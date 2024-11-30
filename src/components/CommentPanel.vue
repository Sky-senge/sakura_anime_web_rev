<template>
  <div class="comment-panel">
    <!-- 评论列表 -->
    <el-table :data="commentList" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="user" label="用户"></el-table-column>
      <!-- 其他需要的列 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'CommentPanel',
  data() {
    return {
      commentList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchComments();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchComments();
    },
    fetchComments() {
      // 调用后端接口获取评论列表，并根据分页参数处理数据
    },
    handleDelete(comment) {
      // 删除评论逻辑
    }
  },
  mounted() {
    this.fetchComments();
  }
};
</script>