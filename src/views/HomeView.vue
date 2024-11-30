<template>
  <div class="container">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 推荐大图区域 -->
    <section class="banner">
      <Carousel />
    </section>

    <!-- 视频分类展示 -->
    <section class="video-section">
      <div class="section-header">
        <h2 style="color: beige;">热门推荐</h2>
        <a href="/all" class="view-more">查看更多</a>
      </div>
      <VideoList />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '/src/components/navbar-component.vue';
import Carousel from '/src/components/carousel-component.vue';
import VideoList from '/src/components/video-list-component.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    Navbar,
    Carousel,
    VideoList
  }
});
</script>

<style scoped>
.container {
  background-color: #333;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.banner {
  margin-bottom: 20px;
  position: relative;
}

.video-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 10px;
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  background-color: #333;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.section-header .view-more {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
}

.section-header .view-more:hover {
  text-decoration: underline;
}
</style>
