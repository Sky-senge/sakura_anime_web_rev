<template>
  <div class="video-panel">
    <!-- 操作按钮区域 -->
    <div class="button-group">
      <el-button type="primary" @click="openUploadDialog">
        <i class="el-icon-upload"></i>
        <span>上传视频</span>
      </el-button>
      <el-button type="danger" @click="confirmUnpublishVideo">
        <i class="el-icon-delete"></i>
        <span>下架视频</span>
      </el-button>
      <el-button type="warning" @click="editVideoInfo">
        <i class="el-icon-edit"></i>
        <span>修改视频</span>
      </el-button>
    </div>

    <!-- 视频列表展示区域 -->
    <el-table :data="videoList" style="width: 100%">
      <el-table-column prop="title" label="视频标题" align="left"></el-table-column>
      <el-table-column prop="description" label="视频描述" align="left"></el-table-column>
      <el-table-column prop="status" label="视频状态" align="center"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="editVideoInfo(row)">修改信息</el-button>
          <el-button type="danger" size="small" @click="unpublishVideo(row)">下架视频</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentPageChange"
    />

    <!-- 编辑视频信息对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="videoForm" :rules="videoRules" ref="videoFormRef">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="videoForm.title"></el-input>
        </el-form-item>
        <el-form-item label="视频描述" prop="description">
          <el-input v-model="videoForm.description"></el-input>
        </el-form-item>
        <el-form-item label="视频时长" prop="duration">
          <el-input v-model="videoForm.duration"></el-input>
        </el-form-item>
        <!-- 可根据实际需求添加更多视频信息编辑字段 -->
      </el-form>
      <template #footer>
        <div class="dialog-button-group">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveVideoChanges">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'VideoPanel',
  setup() {
    const videoList = ref([]);
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const videoForm = reactive({
      id: '',
      title: '',
      description: '',
      duration: '',
      // 可根据实际需求添加更多视频相关属性
    });
    const videoRules = reactive({
      title: [{ required: true, message: '请输入视频标题', trigger: 'blur' }],
      description: [{ required: true, message: '请输入视频描述', trigger: 'blur' }],
      duration: [{ required: true, message: '请输入视频时长', trigger: 'blur' }],
    });
    const videoFormRef = ref(null);

    // 总记录数
    const total = ref(0);
    // 当前页码
    const currentPage = ref(1);
    // 每页显示记录数
    const pageSize = ref(10);

    // 获取视频列表数据的函数，结合分页参数
    const fetchVideoList = () => {
      axios.get(`/api/video/list?page=${currentPage.value}&size=${pageSize.value}`)
    .then((response) => {
          videoList.value = response.data.data;
          total.value = response.data.total;
        })
    .catch(() => {
          ElMessage.error('获取视频列表失败');
        });
    };

    // 页面加载时获取视频列表
    fetchVideoList();

    // 打开上传视频文件选择对话框的函数
    const openUploadDialog = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('video', file);
          axios.post('/api/video/upload', formData)
        .then(() => {
              ElMessage.success('视频上传成功');
              fetchVideoList();
            })
        .catch(() => {
              ElMessage.error('视频上传失败');
            });
        }
      };
      input.click();
    };

    // 下架视频函数（在列表中点击下架按钮时调用）
    const unpublishVideo = (row) => {
      ElMessageBox.confirm('确认要下架此视频吗？', '视频下架确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    .then(() => {
          axios.post('/api/video/unpublish', { videoId: row.id })
        .then(() => {
              ElMessage.success('视频下架成功');
              fetchVideoList();
            })
        .catch(() => {
              ElMessage.error('视频下架失败');
            });
        })
    .catch(() => {
          // 用户取消操作，不做任何处理
        });
    };

    // 确认下架视频函数（主下架按钮点击时调用，先弹出确认框）
    const confirmUnpublishVideo = () => {
      ElMessageBox.confirm('确认要下架所有选中的视频吗？', '视频下架确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    .then(() => {
          // 这里可以添加遍历选中视频列表并逐个下架的逻辑，假设只有一个视频被选中，先简单下架当前视频
          const currentVideo = videoList.value[0];
          if (currentVideo) {
            unpublishVideo(currentVideo);
          }
        })
    .catch(() => {
          // 用户取消操作，不做任何处理
        });
    };

    // 编辑视频信息函数
    const editVideoInfo = (row) => {
      dialogTitle.value = '编辑视频信息';
      Object.assign(videoForm, {...row });
      dialogVisible.value = true;
    };

    // 保存视频更改函数
    const saveVideoChanges = () => {
      videoFormRef.value.validate((valid) => {
        if (valid) {
          axios.post('/api/video/update', videoForm)
        .then(() => {
              ElMessage.success('视频信息修改成功');
              dialogVisible.value = false;
              fetchVideoList();
            })
        .else(() => {
              ElMessage.error('视频信息修改失败');
            });
        }
      });
    };

    // 取消编辑视频信息函数
    const cancelEdit = () => {
      dialogVisible.value = false;
    };

    // 分页器页码改变时的处理函数
    const handleCurrentPageChange = (page) => {
      currentPage.value = page;
      fetchVideoList();
    };

    return {
      videoList,
      dialogVisible,
      dialogTitle,
      videoForm,
      videoRules,
      videoFormRef,
      total,
      currentPage,
      pageSize,
      openUploadDialog,
      confirmUnpublishVideo,
      unpublishVideo,
      editVideoInfo,
      saveVideoChanges,
      cancelEdit,
      handleCurrentPageChange
    };
  }
};
</script>

<style scoped>
/* 整体页面布局样式 */
.video-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

.el-button:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 视频列表表格样式 */
.el-table {
  border: 1px solid #e0e0e0;
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
</style>