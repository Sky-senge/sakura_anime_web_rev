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

      <div v-show="!isMobileSearchActive" class="dropdown-menu">
        <div class="search-concent">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="搜索" class="search-bar" v-model="searchQuery" @input="onSearchInput"
            @focus="onSearchFocus" @blur="onSearchBlur" />
          <i v-if="searchQuery" class="bi bi-x-circle-fill" @click="cancelSearch" title="清空">
          </i>
          <!--@input="onSearchInput" @click="onSearchFocus" @blur="onSearchBlur" -->
          <!-- @keydown="onInputKeydown" 用于阻止ElementPlus捕获空格导致输入失败问题 -->
        </div>
        <Dropdown Dropdown :is-dropdown-visible="isDropdownVisible">
          <!-- 动态内容 -->
          <div class="search-dropdown">
            <!-- 番剧分类 -->
            <div v-if="animeResults.length > 0" class="search-category">
              <ul class="search-results">
                <li v-for="(result, index) in animeResults" :key="'anime-' + index" class="search-result-item"
                  @click="jumpToAnime(result.url)">
                  <img v-if="index === 0" :src="result.image" alt="结果图片" class="result-image" />
                  {{ result.name }}
                </li>
              </ul>
            </div>
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
              <p class="search-result-item-n">没有搜索结果</p>
            </div>
            <!-- 查看更多 -->
            <div class="search-more" @click="jumpTo(`/search?kw=${searchQuery}`)" v-if="filteredResults.length > 0">
              <button class="view-more-button">查看更多结果</button>
            </div>
          </div>
        </Dropdown>
      </div>


      <div class="dropdown-menu-m" v-show="isMobileSearchActive">
        <div class="search-concent-mobile" :class="{ show: isMobileSearchActive }">
          <input type="text" placeholder="搜索" class="search-bar-m" v-model="searchQuery" @input="onSearchInput"
          @focus="onSearchFocus" @blur="onSearchBlur"/>
          <button class="cc-btn" @click="clearOrCancelSearch">
            {{ searchQuery ? '清空' : '取消' }}
          </button>
        </div>
        <Dropdown Dropdown :is-dropdown-visible="isDropdownVisible">
          <!-- 动态内容 -->
          <div class="search-dropdown-m">
            <!-- 番剧分类 -->
            <div v-if="animeResults.length > 0" class="search-category">
              <ul class="search-results">
                <li v-for="(result, index) in animeResults" :key="'anime-' + index" class="search-result-item"
                  @click="jumpToAnime(result.url)">
                  <img v-if="index === 0" :src="result.image" alt="结果图片" class="result-image" />
                  {{ result.name }}
                </li>
              </ul>
            </div>
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
              <p class="search-result-item-n">没有搜索结果</p>
            </div>
            <!-- 查看更多 -->
            <div class="search-more" @click="jumpTo(`/search?kw=${searchQuery}`)" v-if="filteredResults.length > 0">
              <button class="view-more-button">查看更多结果</button>
            </div>
          </div>
        </Dropdown>
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
import Dropdown from '@/components/Dropdown.vue';

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
const isMouseClick = ref(false); // 鼠标是否已经点击


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
// const allResults = ref([
//   // 模拟数据
//   { type: 'anime', name: '番剧1', image: 'https://via.placeholder.com/50', url:'/videoPlayback/1/3' },
//   { type: 'anime', name: '番剧2', image: 'https://via.placeholder.com/50', url: null },
//   { type: 'related', name: '相关1', url: null },
//   ...
// ]);

const allResults = ref<SearchResultItem[]>([]); //搜索结果集

interface SearchResultItem { //对应接口
  type: 'anime' | 'related';
  name: string;
  image?: string;
  url: string | null;
}


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

// 监听搜索框visibility
// watch(() => isDropdownVisible.value, (newName, oldName) => {
//   console.log('搜索框变化', newName)
// })

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

// 激活搜索
const activateSearch = () => {
  isMobileSearchActive.value = true
  displayLogo.value = false;
}

// 清空或取消搜索
const clearOrCancelSearch = () => {
  if (searchQuery.value) {
    searchQuery.value = ''
  } else {
    isMobileSearchActive.value = false
    toggleLogoDisplay()
  }
}

// 清空搜索
const cancelSearch = () => {
  searchText.value = ''
}

// 搜索结果过滤
const filteredResults = computed(() =>
  // allResults.value.filter((result) => result.name.includes(searchQuery.value)).slice(0, 6) //暂时不太明白你这里想过滤什么，总之这个把模糊搜索搞炸了
  allResults.value.filter((result) => allResults.value)
);

const animeResults = computed(() =>
  filteredResults.value.filter((result: any) => result.type === 'anime')
);

const relatedResults = computed(() =>
  filteredResults.value.filter((result) => result.type === 'related')
);

// 输入事件：动态更新下拉框显示状态
const onSearchInput = (event: any) => {
  // 只有当searchText和searchQuery不为空才触发
  // 不要启用，启用会导致搜索框自己没掉
  // isDropdownVisible.value = searchText.value.trim() !== '' && searchQuery.value.trim() !== '';
  setTimeout(() => {
    searchPreviewResultGetter();
  }, 30);
};

// 聚焦事件：显示下拉框
const onSearchFocus = () => {
  // isMouseClick.value = false;
  // isDropdownVisible.value = searchQuery.value.trim() !== '';
  isDropdownVisible.value = true;
};

// 失焦事件：隐藏下拉框
const onSearchBlur = () => {
  console.log("搜索框失焦")
  setTimeout(() => {
    isDropdownVisible.value = false;
    searchQuery.value = '';
    searchText.value = ''; //同时清空内容
    allResults.value = [];
  }, 200); // 延时关闭，避免用户操作中断
};

const handleClick = () => {
  isMouseClick.value = true;
}

const setDropdownVisibility = (visible: boolean) => {
  isDropdownVisible.value = visible;
};

// 阻止冒泡事件，导致无法输入空格或者意外切换Dropdown，用于El-Drop-Menu，已废弃
const onInputKeydown = (event: any) => {
  const blockedKeys = ['Enter', ' ', 'ArrowDown', 'NumpadEnter'];
  if (blockedKeys.includes(event.key)) {
    // console.log("尝试阻止: "+event.key)
    event.stopPropagation(); // 阻止事件冒泡到 el-dropdown
    event.preventDefault();
  }
};

// 查看更多结果
const viewMore = () => {
  console.log('查看更多结果');
};

// 请求并返回搜索动漫结果
const searchPreviewResultGetter = async () => {
  const response = await request.get(`/anime/searchByName?keyWord=${searchQuery.value}&size=12`);
  if (response.data.status) {
    allResults.value = response.data.data.map((item: {
      id: number; name: string; filePath: {
        episodes: number; fileName: string;
      }[];
    }) => ({
      type: 'anime',
      name: item.name,
      image: item.filePath.length > 0 ? `http://localhost:8080/files/getCover/${item.filePath[0].fileName}` : 'http://localhost:8080/files/getCover/default',
      url: item.filePath.length > 0 ? `/Videoplayback/${item.id}/${item.filePath[0].episodes}` : null
    }));
  }
  console.log(`搜索结果：`)
  console.log(allResults.value)
};

// 处理跳转动漫
const jumpToAnime = (url: string | null) => {
  if (url === null) {
    return;
  } else {
    if (route.name === 'Videoplayback') {
      playerStore.theWayTo = url; // 邪恶的同路径跳转黑科技(bushi
      jumpTo('/');
    } else {
      jumpTo(url);
    }
  }
}

// 监听最大化事件（间接通过 resize）
const handleWindowMaximized = () => {
  handleResize() // 调用 handleResize，确保最大化时检查窗口宽度
}

// 在组件挂载时添加监听器
onMounted(() => {
  checkIsIndex() // 不要改动这个顺序，checkIsIndex必须在前面
  window.addEventListener('resize', handleResize)
  window.addEventListener('resize', handleWindowMaximized)
  document.addEventListener('click', handleClick)
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

.search-dropdown {
  border: none;
}

.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-result-item {
  padding: 15px 10px;
  cursor: pointer;
  display: flex;
  font-weight: 600;
  width: 100%;
  gap: 12px;
  align-items: center;
}

.search-result-item-n {
  font-weight: 600;
}

.no-results {
  text-align: center;
}

.search-result-item:hover {
  background-color: #e0e0e0;
}

.result-image {
  width: 40px;
  height: 40px;
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
}

.view-more-button {
  border: none;
  background: none;
  border-top: 1px solid #ccc;
  width: 100%;
  color: rgb(79, 79, 79);
  font-weight: 600;
  padding: 20px 0;
  cursor: pointer;
}

.view-more-button:hover {
  color: rgb(66, 66, 66);
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
  padding: 8px 0px;
  transition: all .3s;
}

.bottom-nav {
  padding: 12px 0px;
}

.search-bar-m,
.search-concent {
  width: 500px;
  display: flex;
  align-items: center;
  background-color: #e2e4e6;
  padding: 9px 12px;
  border-radius: 8px;
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


  .dropdown-menu-m{
    max-width: 100%;
    width: 100%;
  }

  .search-concent-mobile {
    display: flex;
    background: none;
    justify-content: flex-start;
    align-items: center;
    transition: all .3s;
  }

  .search-concent-mobile.show {
    color: #373737;
    background: #e2e4e7;
    width: 100%;
    border-radius: 6px;
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
    margin-right: 10px;
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
  padding: 8px;
  cursor: pointer;
}
</style>