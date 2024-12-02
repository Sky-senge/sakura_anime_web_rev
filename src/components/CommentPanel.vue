<template>
  <div class="comment-panel">
    <!-- 操作按钮区域 -->
    <div class="button-group">
      <el-button type="danger" @click="openDeleteDialog">删除评论</el-button>
    </div>

    <!-- 评论列表展示区域 -->
    <el-table :data="commentList" style="width: 100%">
      <el-table-column prop="content" label="评论内容" align="left"></el-table-column>
      <el-table-column prop="user" label="用户" align="left"></el-table-column>
      <el-table-column prop="reportCount" label="举报次数" align="center"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="confirmDelete(row)">删除</el-button>
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

    <!-- 删除评论确认对话框 -->
    <el-dialog :visible.sync="deleteDialogVisible" title="删除评论">
      <p>确定要删除这条评论吗？</p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteComment">确认删除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'CommentPanel',
  setup() {
    const commentList = ref([]);
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10); // 每页显示的评论数
    const deleteDialogVisible = ref(false);
    const selectedComment = ref(null);

    const fetchCommentList = () => {
      axios.get(`/api/comments?page=${currentPage.value}&size=${pageSize.value}`)
        .then((response) => {
          commentList.value = response.data.data;
          total.value = response.data.total;
        })
        .catch(() => {
          ElMessage.error('获取评论列表失败');
        });
    };

    const openDeleteDialog = (comment) => {
      selectedComment.value = comment;
      deleteDialogVisible.value = true;
    };

    const confirmDelete = (row) => {
      openDeleteDialog(row);
    };

    const deleteComment = () => {
      if (!selectedComment.value) return;
      axios.delete(`/api/comments/${selectedComment.value.id}`)
        .then(() => {
          ElMessage.success('评论删除成功');
          fetchCommentList(); // 重新获取评论列表
          deleteDialogVisible.value = false;
        })
        .catch(() => {
          ElMessage.error('删除评论失败');
        });
    };

    const handleCurrentPageChange = (page) => {
      currentPage.value = page;
      fetchCommentList();
    };

    fetchCommentList(); // 获取初始评论列表

    return {
      commentList,
      total,
      currentPage,
      pageSize,
      deleteDialogVisible,
      confirmDelete,
      deleteComment,
      handleCurrentPageChange,
    };
  }
};
</script>

<style scoped>
.comment-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.el-table {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>