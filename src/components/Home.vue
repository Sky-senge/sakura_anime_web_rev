<template>
  <div class="home">
    <el-container class="main-container">
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <img src="https://img0.baidu.com/it/u=746753980,1537730619&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=569" alt="Logo" class="logo-img" />
        </div>
        <el-menu default-active="1-1" class="el-menu-vertical-demo" :default-openeds="['1', '2', '3', '4']">
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
          <el-submenu index="3">
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
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">Sakura Anime 后台管理</el-header>
        <el-main class="main">
          <component :is="currentPanel" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import UserPanel from './UserPanel.vue';
import VideoPanel from './VideoPanel.vue';
import CommentPanel from './CommentPanel.vue';
import DanmuPanel from './DanmuPanel.vue';

export default {
  name: 'Home',
  components: {
    UserPanel,
    VideoPanel,
    CommentPanel,
    DanmuPanel
  },
  data() {
    return {
      currentPanel: 'UserPanel' // 默认显示用户管理模块
    };
  },
  methods: {
    switchPanel(panel) {
      this.currentPanel = `${panel}Panel`;
    }
  }
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

.header {
  background-color: #4a90e2;
  text-align: center;
  line-height: 60px;
  color: #ffffff;
  border-radius: 0 8px 0 0;
}

.main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>