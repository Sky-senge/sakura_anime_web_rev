<template>
  <header class="navbar">
    <div class="left-nav">
      <div class="logo">o</div>
      <nav class="nav-links">
        <el-button type="primary" size="small" class="nav-button-l" @click="home">首页</el-button>
        <el-button size="small" class="nav-button-l" @click="sort()">分类</el-button>
        <el-button size="small" class="nav-button-l" @click="ranking()">排行</el-button>
      </nav>
    </div>
    <nav class="right-nav">
      <div class="search-concent">
        <i class="bi bi-search"></i>
        <input placeholder="搜索" class="search-bar" />
      </div>
      <button size="small" class="nav-button" @click="jumpToLogin()">登录</button>
      <button size="small" class="nav-button"><i class="bi bi-clock-history"></i></button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router';
// import request from '@/utils/request'

// 控制登录框的显示状态
//const dialogVisible = ref(false)
const router = useRouter();


// 登录表单数据
// const loginForm = reactive({
//   username: '',
//   password: '',
// })

// 表单验证规则
// const rules = {
//   username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
//   password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
// }

// 表单引用
const loginFormRef = ref()

// 重置表单
// const resetForm = (done?: () => void) => {
//   loginForm.username = ''
//   loginForm.password = ''
//   if (done) done()
// }
const jumpToLogin = () => {
  router.push('/login')
}
const sort = () => {
  router.push('/sort')
}
const ranking = () => {
  router.push('/ranking')
}
const home =() => {
  router.push('/')
}

// 提交登录
// const submitLogin = async () => {
//   loginFormRef.value?.validate(async (valid: boolean) => {
//     if (valid) {
//       try {
//         const response = await request.post('/user/login', loginForm)
//         if (response.data.status) {
//           const { token, userId } = response.data.data
//           const userStore = useUserStore()
//           userStore.setUser({ token, userId })
//           dialogVisible.value = false
//           resetForm()
//           console.log('登录成功', response.data.message)
//         } else {
//           console.error('登录失败:', response.data.message)
//         }
//       } catch (error) {
//         console.error('网络错误:', error)
//       }
//     } else {
//       console.log('表单验证失败')
//     }
//   })
// }
</script>

<style scoped>
.navbar {
  user-select: none;
  position: sticky;
  top: 0;
  background-color: #368dff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  background-color: #fff;
  font-size: 1.3em;
  font-weight: 800;
  height: 1.5rem;
  width: 1.5rem;
  padding: 3px;
  margin: 0.3rem;
  border-radius: 25px;
  text-align: center;
  justify-content: center;
  color: #7f2fff;
}

.right-nav,
.nav-links {
  display: flex;
  align-items: center;
  gap: 0px;
}

.right-nav {
  gap: 10px;
}

.bi {
  font-weight: 800;
}

.nav-button-l,
.nav-button {
  color: #d2d2d2;
  font-size: 0.85rem;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-button-l:hover {
  background: none;
  color: #fff;
}

.nav-button:hover {
  background: none;
  color: #fff;
  text-decoration: none;
}

.search-concent {
  background-color: #fff;
  padding: 4px;
  border-radius: 25px;
}

.search-concent i {
  font-size: 0.7rem;
  padding: 8px 4px;
}

.search-bar {
  font-size: 0.8rem;
  border: none;
  background: none;
  outline: none;
}
</style>
