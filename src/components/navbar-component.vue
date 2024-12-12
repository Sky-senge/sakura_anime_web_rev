<template>
  <header class="navbar">
    <div class="nav">
      <span class="logo">sakura</span>
      <nav class="left-nav" v-show="!isSearchActive">
        <button size="small" class="nav-button-l" @click="jumpTo('/')">首页</button>
        <button size="small" class="nav-button-l" @click="jumpTo('/sort')">全部</button>
        <button size="small" class="nav-button-l" @click="jumpTo('/ranking')">排行榜</button>
      </nav>
      <div class="search-concent" v-show="!isSearchActive">
        <i class="bi bi-search"></i>
        <input type="text" placeholder="搜索" class="search-bar" />
      </div>
      <div class="search-concent-mobile" v-show="isSearchActive" :class="{ show: isSearchActive }">
        <input type="text" placeholder="搜索" class="search-bar-m" v-model="searchText" />
        <button class="cc-btn" v-show="isSearchActive" @click="clearOrCancelSearch">
          {{ searchText ? '清空' : '取消' }}
        </button>
      </div>
      <nav class="right-nav" v-show="!isSearchActive">
        <i class="bi bi-search btnm" v-if="!isSearchActive" @click="activateSearch"></i>
        <button size="small" class="nav-button" @click="jumpTo('/login')">登录</button>
        <button size="small" class="nav-button"><i title="历史记录" class="bi bi-clock-history"></i></button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute,useRouter } from 'vue-router'
// import request from '@/utils/request'

// 控制登录框的显示状态
// const dialogVisible = ref(false)
const router = useRouter();
const route = useRoute();

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

// 搜索状态控制
const isSearchActive = ref(false)

// 搜索文本
const searchText = ref('')

// 重置表单
// const resetForm = (done?: () => void) => {
//   loginForm.username = ''
//   loginForm.password = ''
//   if (done) done()
// }

// 导航跳转方法
const jumpTo = (path: string) => {
  router.push(path)
  // 防止被播放器卡住
  if(route.name==='Videoplayback'){
    window.location.href = path;
  }
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

// 激活搜索
const activateSearch = () => {
  isSearchActive.value = true
}

// 清空或取消搜索
const clearOrCancelSearch = () => {
  if (searchText.value) {
    searchText.value = ''
  } else {
    isSearchActive.value = false
  }
}

// 监听窗口大小变化
const handleResize = () => {
  // 当窗口宽度大于移动端断点时
  if (window.innerWidth >= 768) {
    isSearchActive.value = false  // 关闭搜索状态
    searchText.value = ''         // 清空搜索文本
  }
}

// 监听最大化事件（间接通过 resize）
const handleWindowMaximized = () => {
  handleResize() // 调用 handleResize，确保最大化时检查窗口宽度
}

// 在组件挂载时添加监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('resize', handleWindowMaximized)
  // 在初始化时检查一次窗口大小
  handleResize()
})

// 在组件卸载时移除监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('resize', handleWindowMaximized)
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  background-color: #ff4d00;
  box-shadow: 0 2px 10px #ff8c001c;
  z-index: 1000;
  padding: 10px 35px;
}

.logo {
  font-size: 1.3rem;
  color: #fff;
  font-weight: 800;
}

.btnm {
  display: none;
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

.search-bar-m,
.search-concent {
  width: 500px;
  background-color: #fff;
  padding: 12px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.search-bar-m {
  display: none;
}

.search-concent-mobile {
  display: none;
}

.left-nav,
.right-nav {
  display: flex;
  align-items: center;
  gap: 20px;
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

  .left-nav,
  .right-nav {
    padding: 12px 0px;
  }

  .btnm {
    color: #e5e5e5;
    display: block;
  }

  .search-concent {
    display: none;
  }

  .search-concent-mobile {
    display: flex;
    width: 20px;
    max-width: 0;
    background: none;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    transition: all .3s;
  }

  .search-concent-mobile.show {
    background: #fff;
    max-width: 100%;
    width: 100%;
    border-radius: 6px;
    padding: 0 10px;
  }

  .search-bar-m {
    flex: 1;
    display: block;
    border: none;
    background: none;
    outline: none;
    font-weight: 800;
    color: rgb(52, 52, 52);
  }

  .cc-btn {
    border: none;
    background: none;
    font-weight: 800;
    font-size: 0.8rem;
    letter-spacing: 2px;
    color: #ff4d00;
  }

  .logo {
    display: none;
  }

  .nav-button-l,
  .nav-button {
    font-size: 0.88rem;
  }
}

@media (max-width: 550px) {
  .left-nav {
    display: flex;
    align-items: center;
    overflow-x: auto;
    white-space: nowrap;
  }
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

.search-bar {
  font-weight: 600;
  font-size: 0.8rem;
  border: none;
  background: none;
  outline: none;
  flex: 1;
}

.search-concent i {
  font-size: 0.7rem;
  padding: 8px 4px;
  cursor: pointer;
}
</style>