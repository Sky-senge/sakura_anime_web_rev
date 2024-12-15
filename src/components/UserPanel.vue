<template>
  <div class="user-management-page">
    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="addUser">新增用户</el-button>
      <!-- <el-button type="danger" @click="deleteUser">删除用户</el-button>
      <el-button type="warning" @click="editUser">修改用户</el-button> -->
      <el-button type="info" @click="queryUser">刷新列表</el-button>
    </div>

    <!-- 用户列表表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="displayNameDisplay" label="昵称"></el-table-column>
      <el-table-column prop="permissionDisplay" label="权限"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editUser(row)">修改</el-button>
          <el-button :type="row.permission >= 2 ? 'info' : 'warning'" @click="row.permission >= 2 ? unlockUser(row) : blockUser(row)">
            {{ row.permission >= 2 ? '一键解封' : '一键封禁' }}
          </el-button>
          <el-button type="danger" size="small" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentPageChange" />

    <!-- 对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input-number v-model="userForm.permission" :nim="0" :max="10" step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" placeholder="留空则不修改密码"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="userForm.displayName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="userForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage,ElMessageBox } from 'element-plus';

const dialogVisible = ref(false);
const dialogTitle = ref('');
const userForm = reactive({
  id: null,
  username: '',
  avatar:'',
  email: '',
  permission: 1,
  password: '',
  displayName: '',
  remarks: '',
});
const userRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
});
const userFormRef = ref(null);

const userList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(15);

const fetchUserList = () => {
  // 获取用户列表
  request
    .get(`/user/getUserList?page=${currentPage.value}&size=${pageSize.value}`)
    .then((response) => {
      if (response.data.status) {
        userList.value = response.data.data.map((user) => ({
          id: user.id,
          avatar: user.avatar,
          username: user.username,
          displayName: user.displayName,
          displayNameDisplay: user.displayName || '无',
          permission: user.permission,
          permissionDisplay: user.permission === 0 ? '管理员' : user.permission === 2 ? '已封锁' : '普通用户', // 根据权限解析状态
          email: user.email,
          remarks: user.remarks || '无',
        }));
      } else {
        ElMessage.error(response.data.message || '获取用户列表失败');
      }
    })
    .catch(() => {
      ElMessage.error('网络错误，获取用户列表失败');
    });
  // 获取总用户数
  request
    .get(`/user/countUserPage?size=${pageSize.value}`)
    .then((response) => {
      if (response.data.status) {
        total.value = response.data.data * 10;
      } else {
        ElMessage.error(response.data.message || '获取用户总数失败');
      }
    })
    .catch(() => {
      ElMessage.error('网络错误，获取用户总数失败');
    });
};

// 加载数据
const loadData = async () => {
  await fetchUserList();
};

//哄人用的刷新按钮，因为页面会自动刷新，所以不需要
const queryUser = () =>{
  ElMessage.success("刷新成功！")
}

// 分页切换
const handleCurrentPageChange = async (page) => {
  currentPage.value = page;
  await fetchUserList();
};

const addUser = () => {
  dialogTitle.value = '新增用户';
  Object.assign(userForm, { username: '', email: '', remarks: '' });
  dialogVisible.value = true;
};

const deleteUser = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${row.username}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      console.log('删除用户:', row.id);
      request
        .get(`/user/deleteUser/${row.id}`) // 使用 GET 方法，并将 UID 拼接到 URL 中
        .then((response) => {
          if (response.data.status) {
            ElMessage.success('删除成功');
            fetchUserList(); // 刷新用户列表
          } else {
            ElMessage.error(response.data.message || '删除失败');
          }
        })
        .catch(() => {
          ElMessage.error('网络错误，删除失败');
        });
    })
    .catch(() => {
      ElMessage.info('已取消删除'); // 用户取消删除操作
    });
};

const editUser = (row) => {
  dialogTitle.value = '修改用户';
  Object.assign(userForm, {...row,avatar: row.avatar});
  dialogVisible.value = true;
};

const blockUser = (row) =>{
  Object.assign(userForm,{...row,permission: 2});
  try{
    submitUser()
    ElMessage.success("已封锁账户")
  }catch(error){
    console.log(row)
    console.log(userForm)
    ElMessage.error("操作失败！",error)
  }
}

const unlockUser = (row) =>{
  Object.assign(userForm,{...row,permission: 1});
  try{
    submitUser()
    ElMessage.success("已解除封锁")
  }catch(error){
    ElMessage.error("操作失败！")
    console.error("操作失败！",error)
  }
}
const submitUser = () => {
      const apiUrl = '/user/updateUser';
      request
        .post(apiUrl, userForm)
        .then((response) => {
          if (response.data.status) {
            ElMessage.success(dialogTitle.value === '新增用户' ? '添加成功' : '修改成功');
            fetchUserList(); // 刷新列表
          } else {
            ElMessage.error(response.data.message || '操作失败');
          }
        })
        .catch(() => {
          ElMessage.error('网络错误，操作失败');
        });
};

const submitUserForm = () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      const apiUrl = dialogTitle.value === '新增用户' ? '/user/register' : '/user/updateUser';
      request
        .post(apiUrl, userForm)
        .then((response) => {
          if (response.data.status) {
            ElMessage.success(dialogTitle.value === '新增用户' ? '添加成功' : '修改成功');
            dialogVisible.value = false;
            fetchUserList(); // 刷新列表
          } else {
            ElMessage.error(response.data.message || '操作失败');
          }
        })
        .catch(() => {
          ElMessage.error('网络错误，操作失败');
        });
    }
  });
};

onMounted(loadData);
</script>


<style scoped>
.user-management-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.el-button {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.el-button:hover {
  color: #696969;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-table .el-button {
  margin: 2px 0; /* 表格中的按钮不需要额外的外边距 */
}

.el-table {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.el-table thead {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 10px;
}

.el-table tbody tr {
  height: 40px;
  transition: background-color 0.3s;
}

.el-table tbody tr:hover {
  background-color: #f9f9f9;
}

.el-table td {
  font-size: 14px;
  color: #333;
  text-align: center;
}

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

.el-dialog {
  width: 400px;
  margin: auto;
  border-radius: 4px;
}

.el-dialog :title {
  font-size: 20px;
  font-weight: bold;
}

.el-dialog form {
  padding: 20px;
}

.el-dialog button {
  width: 100px;
  height: 40px;
  border-radius: 4px;
  margin: 0 10px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.el-dialog button:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>