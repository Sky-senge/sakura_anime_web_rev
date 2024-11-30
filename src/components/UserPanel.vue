<template>
  <div>
    <!-- 操作按钮 -->
    <el-button type="primary" @click="addUser">新增用户</el-button>
    <el-button type="danger" @click="deleteUser">删除用户</el-button>
    <el-button type="warning" @click="editUser">修改用户</el-button>
    <el-button type="info" @click="queryUser">查询用户</el-button>

    <!-- 用户列表表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="account" label="用户账户"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="status" label="账号状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="editUser(row)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentPageChange"
    />

    <!-- 对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef">
        <el-form-item label="用户账户" prop="account">
          <el-input v-model="userForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-select v-model="userForm.status">
            <el-option label="正常" value="active"></el-option>
            <el-option label="冻结" value="frozen"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const userForm = reactive({
      account: '',
      password: '',
      status: 'active'
    });
    const userRules = reactive({
      account: [{ required: true, message: '请输入用户账户', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    });
    const userFormRef = ref(null);

    const userList = ref([]);
    const total = ref(0);
    const currentPage = ref(1);

    const addUser = () => {
      dialogTitle.value = '新增用户';
      userForm.account = '';
      userForm.password = '';
      userForm.status = 'active';
      dialogVisible.value = true;
    };

    const deleteUser = (row) => {
      axios.post('/api/user/delete', { account: row.account })
        .then(() => {
          ElMessage.success('删除成功');
          fetchUserList();
        })
        .catch(() => {
          ElMessage.error('删除失败');
        });
    };

    const editUser = (row) => {
      dialogTitle.value = '修改用户';
      Object.assign(userForm, { ...row });
      dialogVisible.value = true;
    };

    const submitUserForm = () => {
      userFormRef.value.validate((valid) => {
        if (valid) {
          axios.post('/api/user/' + (dialogTitle.value === '新增用户' ? 'add' : 'update'), userForm)
            .then(() => {
              ElMessage.success(dialogTitle.value === '新增用户' ? '添加成功' : '修改成功');
              dialogVisible.value = false;
              fetchUserList();
            })
            .catch(() => {
              ElMessage.error('操作失败');
            });
        }
      });
    };

    const queryUser = () => {
      // 查询用户逻辑
    };

    const handleCurrentPageChange = (page) => {
      currentPage.value = page;
      fetchUserList();
    };

    const fetchUserList = () => {
      axios.get(`/api/user/list?page=${currentPage.value}&size=10`)
        .then((response) => {
          userList.value = response.data.data;
          total.value = response.data.total;
        })
        .catch(() => {
          ElMessage.error('获取用户列表失败');
        });
    };

    fetchUserList();

    return {
      dialogVisible,
      dialogTitle,
      userForm,
      userRules,
      userFormRef,
      userList,
      total,
      currentPage,
      addUser,
      deleteUser,
      editUser,
      submitUserForm,
      queryUser,
      handleCurrentPageChange
    };
  }
};
</script>

<style scoped>
/* 添加您的样式 */
</style>