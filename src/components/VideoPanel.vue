<template>
  <div class="video-panel">
    <!-- 视频列表 -->
    <el-table :data="videoList" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="uploader" label="上传者"></el-table-column>
      <!-- 其他需要的列 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handleShelf(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 上传视频表单 -->
    <el-dialog title="上传视频" :visible.sync="dialogVisible">
      <!-- 表单内容 -->
      <el-form>
        <el-form-item label="视频文件">
          <el-upload action="#" :on-change="handleFileChange">
            <el-button size="small" type="primary">点击上传视频</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="newVideo.title"></el-input>
        </el-form-item>
        <!-- 其他表单项 -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUploadVideo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VideoPanel',
  data() {
    return {
      videoList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      newVideo: {
        title: ''
        // 其他字段
      },
      selectedFile: null
    };
  },
  methods: {
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchVideos();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchVideos();
    },
    fetchVideos() {
      // 调用后端接口获取视频列表，并根据分页参数处理数据
    },
    handleFileChange(file) {
      // 处理文件选择
      this.selectedFile = file.raw;
    },
    handleUploadVideo() {
      // 调用后端接口上传视频
      this.dialogVisible = false;
    },
    handleEdit(video) {
      // 编辑视频逻辑
    },
    handleShelf(video) {
      // 下架视频逻辑
    }
  },
  mounted() {
    this.fetchVideos();
  }
};
</script>