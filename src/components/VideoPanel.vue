<template>
  <div class="video-panel">
    <!-- 操作按钮区域 -->
    <div class="button-group">
      <!-- 功能按钮（根据需要解注释） -->
      <el-button type="primary" @click="openCreateDialog">
        <i class="el-icon-upload"></i>
        <span>新建视频</span>
      </el-button>
    </div>

    <!-- 视频列表展示区域 -->
    <el-table :data="videoList" style="width: 100%;">
      <el-table-column prop="name" label="视频标题" align="left"></el-table-column>
      <el-table-column prop="tags" label="标签" align="left"></el-table-column>
      <el-table-column prop="description" label="视频描述" align="left"></el-table-column>
      <el-table-column prop="rating" label="评分" align="center"></el-table-column>
      <el-table-column prop="releaseDate" label="发行日期" align="center"></el-table-column>
      <el-table-column prop="status" label="视频状态" align="center"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }" class="tile">
          <el-button type="primary" size="small" @click="openUploadVideo(row)">上传视频</el-button>
          <el-button type="success" size="small" :disabled="row.filePath.length === 0"
            @click="openUploadCover(row)">上传封面</el-button>
          <el-button type="info" size="small" :disabled="row.filePath.length === 0"
            @click="openUploadSubtitle(row)">外挂字幕</el-button>
          <el-button type="warning" size="small" @click="editVideoInfo(row)">修改信息</el-button>
          <el-button type="danger" size="small" @click="unpublishVideo(row)">下架视频</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentPageChange" />

    <!-- 编辑/新建 视频对话框 -->
    <el-dialog v-model="isEditDialogVisible" title="修改视频信息">
      <div v-loading="loadingDetail">
        <el-form :model="editForm" label-width="100px">
          <!-- Tab栏 -->
          <el-tabs v-model="activeTab">
            <el-tab-pane label="信息" name="info">
              <el-form-item label="视频标题">
                <el-input v-model="editForm.name" />
              </el-form-item>
              <el-form-item label="评分">
                <el-input-number v-model="editForm.rating" :min="0" :max="10" step="0.1" />
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="简介" name="description">
              <el-form-item label="视频描述">
                <el-input type="textarea" v-model="editForm.description" rows="10" />
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="标签" name="tags">
              <el-form-item label="视频标签">
                <el-input v-model="editForm.tags" placeholder="动漫标签，用逗号分隔" />
              </el-form-item>
              <div class="tag-list">
                <button class="tag-btn" v-for="(tag, index) in types" :key="index"
                  :class="{ 'selected': isTagSelected(tag) }" @click.prevent="toggleTag(tag)">
                  {{ tag }}
                </button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="资源管理" name="resources">
              <el-form-item label="资源管理">
                <div v-for="(file, index) in editForm.filePath" :key="index" class="file-item">
                  <el-row>
                    <el-col :span="4">
                      <el-input-number v-model="file.episodes" :min="1" label="集数" />
                    </el-col>
                    <el-col :span="12">
                      <div style="padding-left: 80px;padding-right: 20px;">
                        <el-input v-model="file.fileName" placeholder="文件名" />
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <el-button type="danger" size="mini" @click="removeFilePath(index)">删除一集</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
              <el-form-item>
                <div style="padding-left: 5px;">
                  <el-button type="primary" plain icon="el-icon-plus" @click="addFilePath">添加一集</el-button>
                </div>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editForm.id ? submitEdit() : submitCreate()">
          {{ editForm.id ? '保存' : '创建' }}
        </el-button>
      </div>
    </el-dialog>


    <!-- 上传视频对话框 -->
    <el-dialog v-model="isUploadDialogVisible" title="上传视频">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="集数">
          <el-input-number v-model="uploadForm.episodes" :min="1" />
        </el-form-item>
        <el-form-item label="选择文件">
          <input type="file" @change="handleFileChange" accept="video/*" class="file-input" />
          <span v-if="selectedFile" class="file-name">已选择: {{ selectedFile.name }}</span>
        </el-form-item>
        <el-form-item label="字幕文件 (可选)">
          <input type="file" @change="handleSubtitleChange" accept=".txt,.ass,.vtt,.srt" class="file-input" />
          <span v-if="selectedSubtitleFile" class="file-name">已选择字幕: {{ selectedSubtitleFile.name }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeVideoUploadDialog()">取消</el-button>
        <el-button type="primary" @click="uploadVideo">上传</el-button>
      </div>
    </el-dialog>

    <!-- 上传封面对话框 -->
    <el-dialog v-model="isUploadCoverDialogVisible" title="上传封面">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="选择文件">
          <input type="file" @change="handleFileChange" accept="image/*" class="file-input" />
          <span v-if="selectedFile" class="file-name">已选择: {{ selectedFile.name }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isUploadCoverDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadCover">上传</el-button>
      </div>
    </el-dialog>

    <!-- 上传字幕对话框 -->
    <el-dialog v-model="isUploadSubtitleDialogVisible" title="上传字幕">
      <el-form :model="uploadForm" label-width="100px">
        <p style="color: red;">注意：web播放器可能不支持外挂字幕，建议上传视频时选中直接渲染</p>
        <el-form-item label="集数">
          <el-input-number v-model="uploadForm.episodes" :min="1" />
        </el-form-item>
        <el-form-item label="选择外挂字幕文件">
          <input type="file" @change="handleFileChange" accept="*" class="file-input" />
          <span v-if="selectedFile" class="file-name">已选择: {{ selectedFile.name }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isUploadSubtitleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadSubtitle">上传</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { request, fileRequest } from '@/utils/request'; // 引入自定义 request

const activeTab = ref('info'); // 默认选中的 Tab
const videoList = ref([]);
const total = ref(0);
const pageSize = ref(15);
const currentPage = ref(1);
const isEditDialogVisible = ref(false);
const loadingDetail = ref(false);
const editForm = reactive({
  id: null,
  name: '',
  tags: [],
  description: '',
  rating: '',
  releaseDate: '',
  filePath: [],
});

const types = [
  '完结', '热血', '奇幻', '动作', '科幻', '喜剧', '治愈', '冒险', '后宫', '百合', '校园',
  '青春', '恋爱', '爱情', '日常', '搞笑', '推理', '悬疑', '机战', '运动', '战争', '战斗',
  '励志', '致郁', '经典', '史诗', '职场', '黑暗', '泡面番', '轻小说', '耽美', '其他', 
  '日本', '大陆', '中国香港', '中国台湾', '韩国', '欧美',
  '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015',
  '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2006', '2005', '2004'
];

// 判断标签是否被选中
const isTagSelected = (tag) => {
  return editForm.tags.includes(tag);
};

// 切换标签选择状态
const toggleTag = (tag) => {
  // 阻止默认表单提交行为
  event.preventDefault();

  const existingTags = editForm.tags.split(',').map(t => t.trim()).filter(t => t);

  if (existingTags.includes(tag)) {
    // 如果标签已经存在，从标签列表中移除
    const updatedTags = existingTags.filter((existingTag) => existingTag !== tag);
    editForm.tags = updatedTags.join(', ');
  } else {
    // 否则，添加标签
    const updatedTags = [...existingTags, tag];
    editForm.tags = updatedTags.join(', ');
  }
};

// 当前操作的视频行
const currentRow = ref(null);
//上传视频
const isUploadDialogVisible = ref(false);
//上传封面
const isUploadCoverDialogVisible = ref(false);
//上传字幕
const isUploadSubtitleDialogVisible = ref(false);
//视频文件上传表单
const uploadForm = reactive({
  animeId: null,
  episodes: 1,
});
//准备上传的文件
const selectedFile = ref(null);
//准备上传的字幕文件
const selectedSubtitleFile = ref(null);
// 加载视频列表
const loadVideoList = async () => {
  try {
    // 获取视频列表数据
    const videoResponse = await request.get('/anime/getAnimeList', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
      },
    });
    if (videoResponse.data.status) {
      // 格式化数据，用于显示
      videoList.value = videoResponse.data.data.map((video) => ({
        id: video.id,
        name: video.name,
        tags: video.tags.join(', '), // 将标签数组转换为字符串
        description: video.description,
        rating: parseFloat(video.rating).toFixed(1), //确保无论如何都显示一位小数
        releaseDate: video.releaseDate,
        filePath: video.filePath,
        status: video.filePath.length === 0 ? '未上传' : '已上传资源',
      }));
    }
    // 获取总页数数据
    const pageResponse = await request.get('/anime/countAnimePage', {
      params: { size: pageSize.value },
    });
    if (pageResponse.data.status) {
      total.value = pageResponse.data.data * 10; // ElementPlus为什么要页数乘以10，而不能直接赋值？我也不知道，反正官方是这样操作的
    }
  } catch (error) {
    console.error('加载视频列表失败', error);
  }
};

// 添加标签
const addTag = (tag) => {
  if (!editForm.tags.includes(tag)) {
    editForm.tags = editForm.tags ? editForm.tags + ',' + tag : tag;
  }
};

// 打开新建视频对话框
const openCreateDialog = () => {
  // 清空表单数据，准备新增视频
  editForm.id = null;  // 新建视频无需 id
  editForm.name = '';
  editForm.tags = [];
  editForm.description = '';
  editForm.rating = 1.0;
  editForm.releaseDate = '';
  editForm.filePath = [];
  // 显示对话框
  isEditDialogVisible.value = true;
};

// 打开编辑对话框
const editVideoInfo = async (row) => {
  loadingDetail.value = true;
  try {
    currentRow.value = row;
    Object.assign(editForm, {
      ...row,
      rating: parseFloat(row.rating),
    });
    console.log(editForm);
    const response = await request.get(`/anime/getDetail/${row.id}`);
    if (response.data.status) {
      editForm.filePath = response.data.data.filePath || [];
    } else {
      ElMessage.error('获取视频详情失败，请稍后重试！');
      editForm.filePath = [];
    }

    isEditDialogVisible.value = true;
  } catch (error) {
    console.error('获取视频详情失败', error);
    ElMessage.error('获取视频详情失败，请稍后重试！');
  } finally {
    loadingDetail.value = false;
  }
};

// 提交修改
const submitEdit = async () => {
  try {
    try {
      if (editForm.tags) {
        // 替换中文逗号为英文逗号
        editForm.tags = editForm.tags.replace(/，/g, ',');
        const invalidCharRegex = /[@\$%\^&\*\(\)\_+\-={}\[\]:";'<>\?\/`]/;
        if (invalidCharRegex.test(editForm.tags)) {
          ElMessage.error('标签中包含非法字符！');
          throw new Error('标签中包含非法字符！');
        }
        editForm.tags = editForm.tags.split(',').map(tag => tag.trim());
      }
    } catch (error) {
      ElMessage.error('Tags类型转换失败，请联络管理员！');
      throw new Error('Tags类型转换失败，请联络管理员！');
    }
    const payload = { ...editForm }; // 准备发送的数据
    const response = await request.post(`/anime/updateAnime`, payload);
    if (response.data.status) {
      ElMessage.success('视频信息更新成功！');
    } else {
      ElMessage({
        type: 'error',
        message: `修改失败: ${response.data.error || '未知错误'}`,
      });
    }
    isEditDialogVisible.value = false;
    loadVideoList(); // 刷新列表
  } catch (error) {
    console.error('修改视频失败', error);
    ElMessage.error('更新视频信息失败，请稍后重试！');
  }
};

// 提交新建视频
const submitCreate = async () => {
  try {
    // 处理标签
    if (editForm.tags) {
      editForm.tags = editForm.tags.replace(/，/g, ','); // 替换中文逗号为英文逗号
      const invalidCharRegex = /[@\$%\^&\*\(\)\_+\-={}\[\]:";'<>\?\/`]/;
      if (invalidCharRegex.test(editForm.tags)) {
        ElMessage.error('标签中包含非法字符！');
        throw new Error('标签中包含非法字符！');
      }
      editForm.tags = editForm.tags.split(',').map(tag => tag.trim());
    }

    // 准备请求体，移除 id 字段
    const payload = { ...editForm }; // 包含所有表单字段

    // 发送请求，创建新的视频
    const response = await request.post(`/anime/createAnime`, payload);

    // 判断返回结果
    if (response.data.status) {
      ElMessage.success('视频信息创建成功！');
    } else {
      ElMessage({
        type: 'error',
        message: `创建失败: ${response.data.error || '未知错误'}`,
      });
    }
    isEditDialogVisible.value = false; // 关闭对话框
    loadVideoList(); // 刷新视频列表
  } catch (error) {
    console.error('新建视频失败', error);
    ElMessage.error('新建视频信息失败，请稍后重试！');
  }
};

// 删除某集
const removeFilePath = (index) => {
  editForm.filePath.splice(index, 1);
};

//关闭对话框
const closeVideoUploadDialog = () => {
  isUploadDialogVisible.value = false
  selectedFile.value = null
  selectedSubtitleFile.value = null
}

// 添加新集
const addFilePath = () => {
  editForm.filePath.push({ episodes: editForm.filePath.length + 1, fileName: '' });
};

// 下架视频方法
const unpublishVideo = (row) => {
  ElMessageBox.confirm(
    `下架该视频将会联动删除该动漫以及动漫下的所有评论。是否继续？`,
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        // 调用 API 执行下架操作
        const response = await request.get(`/anime/deleteAnime/${row.id}`);
        if (response.data.status) {
          ElMessage({
            type: 'success',
            message: '视频下架成功！',
          });
          // 重新加载视频列表
          loadVideoList();
        } else {
          throw new Error(response.data.message || '下架失败');
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: `下架失败: ${error.message || '未知错误'}`,
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消下架操作',
      });
    });
};

// 打开上传视频对话框
const openUploadVideo = (row) => {
  uploadForm.animeId = row.id; // 绑定当前视频的 ID
  isUploadDialogVisible.value = true;
};

// 打开上传封面对话框
const openUploadCover = (row) => {
  uploadForm.animeId = row.id; // 绑定当前视频的 ID
  isUploadCoverDialogVisible.value = true;
};

// 打开上传字幕对话框
const openUploadSubtitle = (row) => {
  uploadForm.animeId = row.id; // 绑定当前视频的 ID
  isUploadSubtitleDialogVisible.value = true;
};

// 处理文件选择
const handleFileChange = (event) => {
  const input = event.target;
  const files = input.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
  }
};

// 处理字幕文件选择（可选）
const handleSubtitleChange = (event) => {
  const input = event.target;
  const files = input.files;
  if (files && files.length > 0) {
    selectedSubtitleFile.value = files[0];
  } else {
    selectedSubtitleFile.value = null; // 清空字幕文件
  }
};

// 上传视频
const uploadVideo = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择文件！');
    return;
  }

  const formData = new FormData();
  formData.append('animeId', uploadForm.animeId);
  formData.append('episodes', String(uploadForm.episodes));
  formData.append('file', selectedFile.value);
  if (selectedSubtitleFile.value) {
    formData.append('subfile', selectedSubtitleFile.value);
  } else {
    // 如果没有选择字幕文件，仍然向表单中添加一个空的subfile字段
    const emptyFile = new File([], "empty.txt");  // 创建一个空文件
    formData.append('subfile', emptyFile);
  }

  try {
    const loadingMessage = ElMessage({
      message: '正在上传，请稍后...',
      type: 'info',
      duration: 0,
    });
    const response = await fileRequest.post('/uploadAnime', formData);
    loadingMessage.close();
    if (response.data.status) {
      ElMessage.success('视频上传完成！');
      isUploadDialogVisible.value = false;
      selectedFile.value = null; // 清空选择的文件
      loadVideoList(); // 刷新视频列表
    } else {
      ElMessage.error('上传失败，请稍后重试！');
    }
  } catch (error) {
    ElMessage.error('上传失败，请检查网络或重试！');
    console.error(error);
  }
};

// 上传封面
const uploadCover = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择文件！');
    return;
  }
  uploadForm.episodes = 1; //封面只会存在于第一集，先重置变量
  const formData = new FormData();
  formData.append('animeId', uploadForm.animeId);
  formData.append('episodes', String(uploadForm.episodes));
  formData.append('file', selectedFile.value);

  try {
    const loadingMessage = ElMessage({
      message: '正在上传，请稍后...',
      type: 'info',
      duration: 0,
    });
    const response = await fileRequest.post('/uploadCover', formData);
    loadingMessage.close();
    if (response.data.status) {
      ElMessage.success('封面上传完成！');
      isUploadCoverDialogVisible.value = false;
      selectedFile.value = null; // 清空选择的文件
      loadVideoList(); // 刷新视频列表
    } else {
      ElMessage.error('上传失败，请稍后重试！');
    }
  } catch (error) {
    ElMessage.error('上传失败，请检查网络或重试！');
    console.error(error);
  }
};

// 上传字幕
const uploadSubtitle = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择文件！');
    return;
  }

  const formData = new FormData();
  formData.append('animeId', uploadForm.animeId);
  formData.append('episodes', String(uploadForm.episodes));
  formData.append('file', selectedFile.value);

  try {
    const loadingMessage = ElMessage({
      message: '正在上传，请稍后...',
      type: 'info',
      duration: 0,
    });
    const response = await fileRequest.post('/uploadSubtitle', formData);
    loadingMessage.close();
    if (response.data.status) {
      ElMessage.success('字幕上传完成！');
      isUploadSubtitleDialogVisible.value = false;
      selectedFile.value = null; // 清空选择的文件
      loadVideoList(); // 刷新视频列表
    } else {
      ElMessage.error('上传失败，请稍后重试！');
    }
  } catch (error) {
    ElMessage.error('上传失败，请检查网络或重试！');
    console.error(error);
  }
};


// 分页处理
const handleCurrentPageChange = (page) => {
  currentPage.value = page;
  loadVideoList();
};

// 初始化
onMounted(() => {
  loadVideoList();
});
</script>

<style scoped>
/* 整体页面布局样式 */
.video-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tag-list {
  display: grid;
  padding: 15px;
  gap: 10px;
  grid-template-columns: repeat(5, 5fr);
}

.tag-btn {
  border: 2px solid #ff8c0000;
  background: #e2e4e8;
  padding: 8px 2px;
  border-radius: 4px;
}

.tag-btn.selected {
  color: #ff8d00;
  border: 2px solid #ff8d00;
  background: #ffffff;
}

.tag-btn:hover {
  color: #ff8d00;
  border: 2px solid #ff8d00;
}

/* 操作按钮组样式 */
.button-group {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.el-button {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.el-table .el-button {
  margin: 2px 0;
  /* 表格中的按钮不需要额外的外边距 */
}

.el-button:hover {
  color: #696969;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 视频列表表格样式 */
.el-table {
  border: 3px solid #e3e3e3;
  border-radius: 4px;
  margin-top: 20px;
}

.el-table thead {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 10px;
}

.el-table tbody tr {
  height: 40px;
  transition: background-color 0.3s;
  margin-bottom: 5px;
}

.el-table tbody tr:hover {
  background-color: 59f9f9;
}

.el-table td {
  font-size: 14px;
  color: #333;
  text-align: center;
}

/* 分页器样式 */
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-pagination button {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  margin: 0 5px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.el-pagination button:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 编辑视频信息对话框样式 */
.el-dialog {
  width: 450px;
  margin: auto;
  border-radius: 4px;
}

.el-dialog :title {
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
}

.el-dialog form {
  padding: 20px;
}

.el-dialog form input[type="text"],
.el-dialog form input[type="password"],
.el-dialog form input[type="number"] {
  padding: 10px;
  border: 1px solid #ccc;
  transition: border-color 0.3s;
}

.el-dialog form input[type="text"]:focus,
.el-dialog form input[type="password"]:focus,
.el-dialog form input[type="number"]:focus {
  border-color: #e0e0e0;
}

.dialog-button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}


.file-item {
  padding: 6px;
}
</style>