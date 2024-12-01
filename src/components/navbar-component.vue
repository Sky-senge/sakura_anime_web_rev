<template>
  <header class="navbar">
    <div class="logo">LOGO</div>
    <nav class="nav-links">
      <!-- 导航链接按钮 -->
      <el-button type="primary" size="small" class="nav-button">首页</el-button>
      <el-button size="small" class="nav-button">分类</el-button>
      <!-- 搜索框 -->
      <el-input placeholder="搜索" class="search-bar" />
      <el-button size="small" class="nav-button">排行</el-button>
      <!-- 登录按钮 -->
      <el-button size="small" class="nav-button" @click="jumpToLogin()">登录</el-button>
      <el-button size="small" class="nav-button">观看记录</el-button>
    </nav>
    
    <!-- 登录框模态框 -->
    <!-- <el-dialog
      v-model="dialogVisible"
      title="登录"
      width="500"
      :before-close="resetForm"
    >
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitLogin">登录</el-button>
        </div>
      </template>
    </el-dialog> -->
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router';
import request from '@/utils/request'

// 控制登录框的显示状态
const dialogVisible = ref(false)
const router = useRouter();


// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 表单引用
const loginFormRef = ref()

// 重置表单
const resetForm = (done?: () => void) => {
  loginForm.username = ''
  loginForm.password = ''
  if (done) done()
}
const jumpToLogin = () => {
  router.push('/login')
}

// 提交登录
const submitLogin = async () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const response = await request.post('/user/login', loginForm)
        if (response.data.status) {
          const { token, userId } = response.data.data
          const userStore = useUserStore()
          userStore.setUser({ token, userId })
          dialogVisible.value = false
          resetForm()
          console.log('登录成功', response.data.message)
        } else {
          console.error('登录失败:', response.data.message)
        }
      } catch (error) {
        console.error('网络错误:', error)
      }
    } else {
      console.log('表单验证失败')
    }
  })
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 99%;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

.nav-links {
  display: flex;
  /* gap: 15px;*/
  column-gap: 15px;
  
}

.nav-button {
  color: #007bff;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-button:hover {
  text-decoration: underline;
}

.search-bar {
  width: 250px;
  height: 24px;
  border-radius: 4px;
}

.dialog-footer {
  text-align: right;
}
</style>

