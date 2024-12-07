<template>
  <div class="container">
    <!-- 导航栏 -->
    <Navbar />
    <!-- 推荐大图区域 -->
    <div class="banner">
      <Carousel />
    </div>
    <!-- 视频分类展示 -->
    <section class="video-section">
      <div class="section-header">
        <div class="title">
          <div class="dot"></div>
          <div class="title-name">热门推荐</div>
        </div>
        <a href="/all" class="view-more">更多</a>
      </div>
      <VideoList />
    </section>
    <Login />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '/src/components/navbar-component.vue';
import Carousel from '/src/components/carousel-component.vue';
import VideoList from '/src/components/video-list-component.vue';
import Login from '/src/views/Login.vue'
import '../assets/home.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default defineComponent({
  name: 'HomePage',
  components: {
    Navbar,
    Carousel,
    VideoList
  }
});
</script>
