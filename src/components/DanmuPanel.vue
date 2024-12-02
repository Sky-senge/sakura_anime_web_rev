<template>
  <div class="danmu-panel">
    <!-- 操作按钮区域 -->
    <div class="button-group">
      <el-button type="danger" @click="openDeleteDialog">删除弹幕</el-button>
    </div>

    <!-- 弹幕列表展示区域 -->
    <el-table :data="danmuList" style="width: 100%">
      <el-table-column prop="content" label="弹幕内容" align="left"></el-table-column>
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

    <!-- 删除弹幕确认对话框 -->
    <el-dialog :visible.sync="deleteDialogVisible" title="删除弹幕">
      <p>确定要删除这条弹幕吗？</p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteDanmu">确认删除</el-button>
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
  name: 'DanmuPanel',
  setup() {
    const danmuList = ref([]);
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10); // 每页显示的弹幕数
    const deleteDialogVisible = ref(false);
    const selectedDanmu = ref(null);

    const fetchDanmuList = () => {
      axios.get(`/api/danmus?page=${currentPage.value}&size=${pageSize.value}`)
        .then((response) => {
          danmuList.value = response.data.data;
          total.value = response.data.total;
        })
        .catch(() => {
          ElMessage.error('获取弹幕列表失败');
        });
    };

    const openDeleteDialog = (danmu) => {
      selectedDanmu.value = danmu;
      deleteDialogVisible.value = true;
    };

    const confirmDelete = (row) => {
      openDeleteDialog(row);
    };

    const deleteDanmu = () => {
      if (!selectedDanmu.value) return;
      axios.delete(`/api/danmus/${selectedDanmu.value.id}`)
        .then(() => {
          ElMessage.success('弹幕删除成功');
          fetchDanmuList(); // 重新获取弹幕列表
          deleteDialogVisible.value = false;
        })
        .catch(() => {
          ElMessage.error('删除弹幕失败');
        });
    };

    const handleCurrentPageChange = (page) => {
      currentPage.value = page;
      fetchDanmuList();
    };

    fetchDanmuList(); // 获取初始弹幕列表

    return {
      danmuList,
      total,
      currentPage,
      pageSize,
      deleteDialogVisible,
      confirmDelete,
      deleteDanmu,
      handleCurrentPageChange,
    };
  }
};
</script>

<style scoped>
.danmu-panel {
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