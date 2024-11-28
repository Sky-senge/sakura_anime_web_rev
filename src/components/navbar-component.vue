<template>
    <header class="navbar">
      <div class="logo">LOGO</div>
      <nav class="nav-links">
        <el-button type="primary" size="small" class="nav-button">首页</el-button>
        <el-button size="small" class="nav-button">分类</el-button>
        <el-input placeholder="搜索" class="search-bar" />
        <el-button size="small" class="nav-button">排行</el-button>
        <el-button size="small" class="nav-button">登录</el-button>
        <el-button size="small" class="nav-button">观看记录</el-button>
      </nav>
    </header>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import '@arco-design/web-vue/dist/arco.css';
  
  export default defineComponent({
    name: 'Navbar'
  });
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
    /* color: white; */
  }
  
  .search-bar {
    width: 200px;
  }
  </style>