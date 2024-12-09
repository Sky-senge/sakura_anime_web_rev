<template>
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
        <a href="/sort" class="view-more">更多</a>
      </div>
      <VideoList />
    </section>
</template>

<script setup>
import VideoList from '/src/components/video-list-component.vue';
import Carousel from '/src/components/carousel-component.vue';
import '../assets/home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
</script>