<template>
  <header class="navbar">
    <div class="nav">
      <span class="logo"> sakura </span>
      <nav class="left-nav">
        <button type="primary" size="small" class="nav-button-l" @click="home()">首页</button>
        <button size="small" class="nav-button-l" @click="sort()">全部</button>
        <button size="small" class="nav-button-l" @click="ranking()">排行榜</button>
      </nav>
      <div class="search-concent">
        <i class="bi bi-search"></i>
        <input type="text" placeholder="搜索" class="search-bar" />
      </div>
      <nav class="right-nav">
        <button size="small" class="nav-button" @click="jumpToLogin()">登录</button>
        <button size="small" class="nav-button"><i title="历史记录" class="bi bi-clock-history"></i></button>
      </nav>
    </div>
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
const home = () => {
  router.push('/')
  window.location.href="/" //确保不会被播放器卡住
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
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  background-color: #ff8d00;
  box-shadow: 0 2px 10px #ff8c001c;
  z-index: 1000;
  padding: 10px 35px;

}

.logo {
  font-size: 1.3rem;
  color: #fff;
  font-weight: 800;
}

.nav {
  transform: translateX(-150px);
  user-select: none;
  width: 1280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all .3s;
}

.search-concent {
  width: 500px;
  background-color: #fff;
  padding: 12px 15px;
  border-radius: 5px;
  transition: all .3s ease;
}

@media (min-width: 1800px) {
  .nav {
    transform: translateX(-100px);
    width: 1600px;
  }

}

@media (max-width: 1800px) {
  .nav {
    transform: translateX(-80px);
    width: 1300px;
  }

  .search-concent {
    width: 600px;
  }
}

@media (max-width: 1620px) {
  .nav {
    transform: translateX(-60px);
    width: 1200px;
  }
}

@media (max-width: 1350px) {
  .nav {
    transform: translateX(-30px);
    width: 980px;
  }

  .search-concent {
    width: 400px;
  }
}

@media (max-width: 1000px) {
  .nav {
    transform: translateX(-10px);
    width: 768px;
  }

  .search-concent {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .nav {
    transform: translateX(0px);
    width: 100%;
  }

  .search-concent {
    width: 200px;
  }

  .logo {
    display: none;
  }
}

@media (max-width: 500px) {
  .search-concent {
    width: 100px;
  }
}

.left-nav,
.right-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.bi {
  font-weight: 800;
}

.nav-button-l,
.nav-button {
  color: #e5e5e5;
  font-size: 0.88rem;
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

.search-concent i {
  font-size: 0.7rem;
  padding: 8px 4px;
}

.search-bar {
  font-weight: 600;
  font-size: 0.8rem;
  border: none;
  background: none;
  outline: none;
}
</style>
