<template>
  <div class="home">
    <el-container class="main-container">
      <el-aside width="20%" class="sidebar">
        <div class="logo">
          <img src="https://img0.baidu.com/it/u=746753980,1537730619&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=569"
            alt="Logo" class="logo-img" />
        </div>
        <el-menu default-active="1-1" class="el-menu-vertical-demo" :default-openeds="['1', '2', '3', '4']"
         text-color="#fff" active-text-color="#ff0d00">
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1" @click="switchPanel('User')">用户管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-video-camera"></i>
              <span>视频管理</span>
            </template>
            <el-menu-item index="2-1" @click="switchPanel('Video')">视频管理</el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="3">
            <template #title>
              <i class="el-icon-chat-line-square"></i>
              <span>评论管理</span>
            </template>
            <el-menu-item index="3-1" @click="switchPanel('Comment')">评论管理</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template #title>
              <i class="el-icon-chat-dot-square"></i>
              <span>弹幕管理</span>
            </template>
            <el-menu-item index="4-1" @click="switchPanel('Danmu')">弹幕管理</el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-container>
        <!-- <el-header class="header">
          Sakura Anime 后台管理
          <div class="header-buttons">
            <button type="primary" @click="login" v-if="!isLoggedIn">登录</button>
            <button type="info" @click="logout" v-if="isLoggedIn">退出登录</button>
          </div>
        </el-header> -->
        <el-main class="main">
          <component :is="currentPanel" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'; 
import { useTokenStatus } from '@/stores/token';
import { ElMessageBox } from 'element-plus';
import request from '@/utils/request';

import UserPanel from '@/components/UserPanel.vue';
import VideoPanel from '@/components/VideoPanel.vue';
import CommentPanel from '@/components/CommentPanel.vue';
import DanmuPanel from '@/components/DanmuPanel.vue';


// 路由实例
const router = useRouter();
// userStore实例化
const userStore = useUserStore();
// TokenStatus实例化
const tokenStatus = useTokenStatus();

// 响应式变量
const currentPanel = ref('UserPanel'); // 默认显示用户管理模块
const isLoggedIn = ref(false); // 记录用户是否登录的状态，初始为未登录

// 切换面板
const switchPanel = (panel) => {
  if (panel === 'User') {
    currentPanel.value = UserPanel;
  } else if (panel === 'Video') {
    currentPanel.value = VideoPanel;
  }
  else if (panel === 'Comment') {
    currentPanel.value = CommentPanel;
  }
  else if (panel === 'Danmu') {
    currentPanel.value = DanmuPanel;
  }
};

const login = () => {
  router.push('/login'); // 使用 `useRouter` 进行路由跳转
  console.log('执行登录操作');
  isLoggedIn.value = true; // 登录成功，更新登录状态为已登录
};

const logout = () => {
  ElMessageBox.confirm(
    "确定要登出吗？",
    '警告',
    {
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning',
    }
  ).then(()=>{
    userStore.clearUser();
    isLoggedIn.value = false; // 退出登录成功，更新登录状态为未登录
    router.push('/')
  })
};

const checkUserPermissionLv = async () => { // 检查用户权限是否满足
  try {
    const response = await request.get('/user/getDetail');
    if (response.data.status && response.data.data) {
      if (response.data.data.permission === 0) {
        return null;  // 如果权限为0（管理员），正确，继续下一步
      } else {
        router.push('/');  // 如果权限不为0，跳转到首页
      }
    } else {
      if(response.data.error.includes("JWT expired")){ //如果Token过期那么给予提示
        tokenStatus.setTokenStatus('1');
      }
      router.push('/');  // 如果状态为false或者data不存在，跳转到首页
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    router.push('/');  // 如果请求失败，也跳转到首页
  }
};


// 加载数据
const loadData = () =>{
currentPanel.value = UserPanel;
userStore.loadUser()
if(userStore.token.length!=0){
  checkUserPermissionLv()
  isLoggedIn.value=true
}else{
  router.push('/'); //没登陆的话也给你送回去首页
}

}
// 初始化检查登入状态
onMounted(loadData);
</script>

<style scoped>
.home {
  height: 100vh;
  overflow: hidden;
}

.main-container {
  height: 100%;
}

.sidebar {
  background-color: #fff;
  border-right: 1.5px solid #e3e3e3;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  gap: 10px;
  height: 100%; /* 占满视口高度 */
  width: 30vh; /* 保持原来的宽度比例 */
  overflow: hidden; /* 禁止滚动 */
  align-items: center;
}

.logo {
  text-align: center;
  width: 100%;
  height: 70px;
}

.logo-img {
  width: 60px;
  height: 60px;
  border: 3px solid #dadada;
  border-radius: 50%;
}

.el-menu-vertical-demo {
  width: 110%;
}

.el-submenu__title,
.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #666;
  font-size: 1rem; 
  font-weight: 800;
 height: 80px;
  transition: all .3s;
}

.el-submenu__title:hover,
.el-menu-item:hover {
  color: #ff20209f;
}

.el-submenu__title i,
.el-menu-item i {
  margin-right: 10px;
}

.el-menu-item {
  justify-content: center;
  padding-left: 50px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 16px; 
  background-color: #ff8000;
  color: #ffffff;
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: normal;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 10px; /* 按钮之间的间距 */
}

.header-buttons button{
  border: none;
  font-size: 0.8rem;
  padding: 12px 24px;
  color: #fff;
background-color: #5a5a5a;
border-radius: 25px;
}

.main {
  padding: 20px;
  background-color: #f5f7fa;
  height: calc(100vh - 40px); /* 减去顶部内边距或其他固定高度 */
  overflow-y: auto; /* 允许纵向滚动，防止滚动传递到外部导致阻塞 */
}
</style>