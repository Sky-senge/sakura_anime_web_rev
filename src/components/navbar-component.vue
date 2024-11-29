<template>
  <header class="navbar">
    <div class="logo">LOGO</div>
    <nav class="nav-links">
      <el-button type="primary" size="small" class="nav-button">首页</el-button>
      <el-button size="small" class="nav-button">分类</el-button>
      <el-input placeholder="搜索" class="search-bar" />
      <el-button size="small" class="nav-button">排行</el-button>
      <el-button size="small" class="nav-button" @click="dialogVisible = true">登录</el-button>
      <el-button size="small" class="nav-button">观看记录</el-button>
    </nav>

    <!-- 登录模态框 -->
    <el-dialog
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
    </el-dialog>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

// 控制模态框的显示
const dialogVisible = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 表单校验规则
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1e1e1e;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-button {
  font-size: 14px;
}

.search-bar {
  width: 200px;
}

.dialog-footer {
  text-align: right;
}
</style>
