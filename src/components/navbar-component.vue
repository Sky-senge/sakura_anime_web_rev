<template>
  <header class="navbar">
    <div class="top-nav">
      <span class="logo" v-show="displayLogo">Sakura</span>
      <nav class="left-nav" v-show="isDisplayLeftNav">
        <button size="small" class="nav-button" @click="jumpTo('/')">首页</button>
        <button size="small" class="nav-button" @click="jumpTo('/sort')">全部</button>
        <button size="small" class="nav-button" @click="jumpTo('/ranking')">排行榜</button>
        <button size="small" class="nav-button" @click="jumpTo('/manage')" v-if="isAdmin">管理后台</button>
      </nav>
      <el-dropdown v-show="!isMobileSearchActive" :popper-class="'dropdown-menu'" trigger="click">
        <div class="search-concent">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="搜索" class="search-bar" v-model="searchQuery" @input="onSearchInput"
            @focus="onSearchFocus" @blur="onSearchBlur" />
        </div>
        <template #dropdown v-show="isDropdownVisible">
          <div class="search-dropdown">
            <!-- 番剧分类 -->
            <div v-if="animeResults.length > 0" class="search-category">
              <ul class="search-results">
                <li v-for="(result, index) in animeResults" :key="'anime-' + index" class="search-result-item">
                  <img v-if="index === 0" :src="result.image" alt="结果图片" class="result-image" />
                  {{ result.name }}
                </li>
              </ul>
            </div>
            <hr>
            <!-- 相关分类 -->
            <div v-if="relatedResults.length > 0" class="search-category">
              <ul class="search-results">
                <li v-for="(result, index) in relatedResults" :key="'related-' + index" class="search-result-item">
                  {{ result.name }}
                </li>
              </ul>
            </div>
            <!-- 没有结果时 -->
            <div v-if="filteredResults.length === 0" class="no-results">
              <ul class="search-results">
                <li class="search-result-item">
                  没有搜索结果
                </li>
              </ul>
            </div>
            <!-- 查看更多 -->
            <div class="search-more" @click="viewMore">
              <button class="view-more-button">查看更多结果</button>
            </div>
          </div>
        </template>
      </el-dropdown>



      <div class="search-concent-mobile" v-show="isMobileSearchActive" :class="{ show: isMobileSearchActive }">
        <input type="text" placeholder="搜索" class="search-bar-m" v-model="searchText" />
        <button class="cc-btn" v-show="isMobileSearchActive" @click="clearOrCancelSearch">
          {{ searchText ? '清空' : '取消' }}
        </button>
      </div>
      <nav class="right-nav" v-show="!isMobileSearchActive">
        <i class="bi bi-search btnm" v-if="!isMobileSearchActive" @click="activateSearch"></i>
        <button size="small" class="nav-button" @click="jumpTo('/WatchHistory')"><i title="历史记录"
              class="bi bi-clock-history"></i></button>
        <button size="small" class="nav-button-l" v-if="!isLoggedIn" @click="jumpTo('/login')">登录</button>
        <el-dropdown v-if="isLoggedIn">
          <span class="nav-button">
            <i class="bi bi-person-circle"></i>
            {{ currentUserName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="User">用户详情</el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" @click="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </nav>
    </div>
    <div class="bottom-nav" v-show="displayLogo">
      <nav class="left-nav">
        <button size="small" class="nav-button" @click="jumpTo('/')">首页</button>
        <button size="small" class="nav-button" @click="jumpTo('/sort')">全部</button>
        <button size="small" class="nav-button" @click="jumpTo('/ranking')">排行榜</button>
        <button size="small" class="nav-button" @click="jumpTo('/manage')" v-if="isAdmin">管理后台</button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/playerStore';
import { ElMessageBox } from 'element-plus';
import {
  SwitchButton,
  User
} from '@element-plus/icons-vue'

// 路由实例
const router = useRouter();
const route = useRoute();

// 状态管理
const userStore = useUserStore();
const playerStore = usePlayerStore();

// 用户状态
const isLoggedIn = ref(false); // 是否登录
const isAdmin = ref(false); // 是否为管理员
const currentUserName = ref(''); // 当前用户名

// UI 状态
const isMobileSearchActive = ref(false); // 是否激活移动端搜索
const displayLogo = ref(true); // 是否显示 Logo
const isIndexPage = ref(false); // 是否为首页
const isMobileStatus = ref(false); // 是否为移动端
const isDisplayLeftNav = ref(false); // 是否显示左侧导航栏（非移动端状态）
const isDropdownVisible = ref(false); // 控制下拉框显示状态


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


// 搜索文本
const searchText = ref('')
const searchQuery = ref(''); // 搜索框输入的值
const allResults = ref([
  // 模拟数据
  { type: 'anime', name: '番剧1', image: 'https://via.placeholder.com/50' },
  { type: 'anime', name: '番剧2', image: 'https://via.placeholder.com/50' },
  { type: 'related', name: '相关1' },
  { type: 'anime', name: '番剧3', image: 'https://via.placeholder.com/50' },
  { type: 'related', name: '相关2' },
  { type: 'related', name: '相关3' },
  { type: 'anime', name: '番剧4', image: 'https://via.placeholder.com/50' },
  { type: 'anime', name: '番剧5', image: 'https://via.placeholder.com/50' },
  { type: 'related', name: '相关4' },
  { type: 'anime', name: '番剧6', image: 'https://via.placeholder.com/50' },
  { type: 'anime', name: '番剧7', image: 'https://via.placeholder.com/50' },
  { type: 'related', name: '相关5' },
  { type: 'related', name: '相关6' }, // 超过12个的结果会被忽略
]);



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
  if (route.name === 'Videoplayback') {
    playerStore.destroyPlayerInstance(); //跳转前销毁播放器实例
    router.replace(path)
  }
}


// 监听路由名称变化，如果不是首页，就隐藏logo和搜索框
watch(() => route.name, (newName, oldName) => {
  console.log('路由参数变化', newName)
  if (newName != 'HomeSubView') {
    isIndexPage.value = false;
    toggleLogoDisplay();
  } else {
    isIndexPage.value = true;
    toggleLogoDisplay();
  }
})

// 单独控制logo是否显示
const toggleLogoDisplay = () => {
  console.log("是移动端搜索状态：" + isMobileSearchActive.value);
  console.log("是移动端？：" + isMobileStatus.value);
  console.log("是否首页：" + isIndexPage.value);
  if (!isMobileSearchActive.value && isIndexPage.value) {
    displayLogo.value = true;
    isDisplayLeftNav.value = false;
  } else if (isMobileStatus.value && isMobileSearchActive.value) {
    displayLogo.value = false;
    isDisplayLeftNav.value = false;
  } else if (isMobileStatus.value) {
    displayLogo.value = true;
    isDisplayLeftNav.value = false;
  }
  else {
    displayLogo.value = false;
    isDisplayLeftNav.value = true;
  }
}

// 监听窗口大小变化
const handleResize = () => {
  // 当窗口宽度大于移动端断点时
  if (window.innerWidth >= 805) {
    isMobileSearchActive.value = false;  // 关闭搜索状态
    isMobileStatus.value = false; //设定为PC状态
    searchText.value = '' // 清空搜索文本  
    toggleLogoDisplay()
  } else if (window.innerWidth <= 805) {
    isMobileStatus.value = true;
    toggleLogoDisplay();
  }
}

const checkIsIndex = () => {
  if (route.name == 'HomeSubView') {
    isIndexPage.value = true;
  }
}

const logout = () => {
  ElMessageBox.confirm(
    "确定要登出吗？",
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    userStore.clearUser();
    isLoggedIn.value = false; // 退出登录成功，更新登录状态为未登录
    router.push('/')
    window.location.href = '/'; //刷新完成登出
  })
};

const checkUserPermissionLv = async () => { // 检查用户权限是否满足
  try {
    const response = await request.get('/user/getDetail');
    if (response.data.status && response.data.data) {
      if (response.data.data.permission === 0) {
        isAdmin.value = true;  // 如果权限为0（管理员），设置flag
      } else {
        isAdmin.value = false;
      }
    } else {
      isAdmin.value = false;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

// 加载数据
const loadData = () => {
  userStore.loadUser()
  if (userStore.token.length != 0) {
    // checkUserPermissionLv()
    isLoggedIn.value = true //标记已登录
    if (userStore.displayName != '') {
      currentUserName.value = userStore.displayName; //如果有的话，获取DisplayName，否则获取username
    } else {
      currentUserName.value = userStore.username;
    }
    if (userStore.isAdmin === true) {
      isAdmin.value = true; //从UserStore中获取状态
    }
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
  isMobileSearchActive.value = true
  displayLogo.value = false;
}

// 清空或取消搜索
const clearOrCancelSearch = () => {
  if (searchText.value) {
    searchText.value = ''
  } else {
    isMobileSearchActive.value = false
    toggleLogoDisplay()
  }
}

// 搜索结果过滤
const filteredResults = computed(() =>
  allResults.value.filter((result) => result.name.includes(searchQuery.value)).slice(0, 6)
);

const animeResults = computed(() =>
  filteredResults.value.filter((result) => result.type === 'anime')
);

const relatedResults = computed(() =>
  filteredResults.value.filter((result) => result.type === 'related')
);

// 输入事件：动态更新下拉框显示状态
const onSearchInput = () => {
  // 只有当 searchText 和 searchQuery 都有值时才更改状态
  isDropdownVisible.value = searchText.value.trim() !== '' && searchQuery.value.trim() !== '';
};

// 聚焦事件：显示下拉框
const onSearchFocus = () => {
  isDropdownVisible.value = searchQuery.value.trim() !== '';
};

// 失焦事件：隐藏下拉框
const onSearchBlur = () => {
  setTimeout(() => (isDropdownVisible.value = false), 200); // 延时关闭，避免用户操作中断
};

// 查看更多结果
const viewMore = () => {
  console.log('查看更多结果');
};

// 监听最大化事件（间接通过 resize）
const handleWindowMaximized = () => {
  handleResize() // 调用 handleResize，确保最大化时检查窗口宽度
}

// 在组件挂载时添加监听器
onMounted(() => {
  checkIsIndex() // 不要改动这个顺序，checkIsIndex必须在前面
  window.addEventListener('resize', handleResize)
  window.addEventListener('resize', handleWindowMaximized)
  // 在初始化时检查一次窗口大小
  handleResize()
  loadData()
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid #d8d8d8;
  z-index: 1000;
  padding: 10px 35px;
}

.logo {
  font-size: 1.3rem;
  color: #ff4040;
  font-weight: 800;
}

.search-drop {
  max-height: 360px;
  border: 1px solid #ddd;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}


.search-results {
  width: 500px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-result-item {
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.search-result-item:hover {
  background-color: #f0f0f0;
}

.result-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}

.search-category {
  margin-bottom: 15px;
}

.category-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.search-more {
  text-align: center;
  margin-top: 10px;
}

.view-more-button {
  border: none;
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.view-more-button:hover {
  background-color: #0056b3;
}


.btnm {
  display: none;
}

.top-nav,
.bottom-nav {
  width: 88%;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  transition: all .3s;
}

.bottom-nav {
  padding: 15px 0px;
}

.search-bar-m,
.search-concent {
  width: 500px;
  background-color: #e5e5e5;
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

.left-nav {
  gap: 30px;
}


@media (max-width: 805px) {
  .top-nav {
    width: 100%;
    padding: 25px 0px;
  }

  .bottom-nav {
    width: 100%;
    padding: 5px 0px;
  }

  .btnm {
    color: #373737;
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
    color: #373737;
    background: #e2e4e7;
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

  .bi {
    cursor: pointer;
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
  color: #373737;
  font-size: 0.88rem;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
  transition: all .3s;
}

.nav-button-l {
  background: #ff4040;
  color: #fff;
  font-size: 0.8rem;
  padding: 8px 10px;
  border-radius: 6px;
}

.nav-button:hover,
.nav-button-l:hover {
  background: none;
  color: #ff4848;
}

.nav-button:hover {
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