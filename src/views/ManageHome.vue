<template>
  <div class="home">
    <el-container class="main-container">
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <img src="https://img0.baidu.com/it/u=746753980,1537730619&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=569"
            alt="Logo" class="logo-img" />
        </div>
        <el-menu default-active="1-1" class="el-menu-vertical-demo" :default-openeds="['1', '2', '3', '4']"
          background-color="#2d3a4b" text-color="#fff" active-text-color="#ffd04b">
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
        <el-header class="header">
          Sakura Anime 后台管理
          <div class="header-buttons">
            <el-button type="primary" @click="login" v-if="!isLoggedIn">登录</el-button>
            <el-button type="info" @click="logout" v-if="isLoggedIn">退出登录</el-button>
          </div>
        </el-header>
        <el-main class="main">
          <component :is="currentPanel" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import UserPanel from '@/components/UserPanel.vue';
import VideoPanel from '@/components/VideoPanel.vue';
import CommentPanel from '@/components/CommentPanel.vue';
import DanmuPanel from '@/components/DanmuPanel.vue';

// 路由实例
const router = useRouter();

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
  // 实际应用中这里需完善与后端交互验证等登录逻辑
  router.push('/login'); // 使用 `useRouter` 进行路由跳转
  console.log('执行登录操作');
  isLoggedIn.value = true; // 登录成功，更新登录状态为已登录
};

const logout = () => {
  // 实际应用中这里需完善与后端交互清除登录状态等退出登录逻辑
  console.log('执行退出登录操作');
  isLoggedIn.value = false; // 退出登录成功，更新登录状态为未登录
};
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
  background-color: #2d3a4b;
  color: #ffffff;
  position: relative;
  padding-top: 60px;
}

.logo {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.logo-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.el-menu-vertical-demo {
  width: 100%;
  margin-top: 20px;
}

.el-submenu__title,
.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #2d3a4b;
  color: #fff;
  height: 100px;
  font-size: 16px; 
  padding-left: 20px;
  transition: background-color 0.3s;
}

.el-submenu__title:hover,
.el-menu-item:hover {
  background-color: #1e272e;
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
  background-color: #2985ed;
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

.main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>