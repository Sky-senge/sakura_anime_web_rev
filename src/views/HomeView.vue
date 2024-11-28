<template>
  <div class="container">
     <!-- 顶部导航 -->
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

    <!-- 轮播图 -->
    <section class="carousel">
      <a-carousel
        :style="{ width: '100%', height: '300px' }"
        :default-current="1"
        @change="handleChange"
      >
        <a-carousel-item v-for="(image, index) in images" :key="index">
          <img
            :src="image"
            alt="轮播图"
            :style="{ width: '100%', height: '100%', objectFit: 'cover' }"
          />
        </a-carousel-item>
      </a-carousel>
    </section>

    <!-- 每周更新 -->
    <section class="weekly-update">
      <!-- <h2>每周更新</h2> -->
      <!-- 每周更新的日期按钮 -->
      <!-- <div class="tabs">
        <el-button
          v-for="day in days"
          :key="day"
          size="small"
          type="text"
          :class="{ active: selectedDay === day }"
          @click="selectedDay = day"
        >
          {{ day }}
        </el-button>
      </div> -->
      <div class="video-list">
        <div v-for="n in 6" :key="n" class="video-card">
          <div class="video-thumbnail">视频封面</div>
          <div class="video-name">视频名字</div>
        </div>
      </div>
    </section>

    <!-- 最新国漫和日漫 -->
    <section class="latest-section">
      <!-- <h2>最新国漫</h2> -->
      <div class="video-list">
        <div v-for="n in 6" :key="n" class="video-card">
          <div class="video-thumbnail">视频封面</div>
          <div class="video-name">视频名字</div>
        </div>
      </div>

      <!-- <h2>最新日漫</h2> -->
      <section class="latest-section"></section>
      <div class="video-list">
        <div v-for="n in 6" :key="n" class="video-card">
          <div class="video-thumbnail">视频封面</div>
          <div class="video-name">视频名字</div>
        </div>
      </div>
    </section>

    <!-- 排行榜，暂不需要 -->
    <!-- <aside class="ranking">
      <div>
        <h3>国漫排行榜</h3>
        <ol>
          <li v-for="(item, index) in ranking" :key="index">{{ index + 1 }}. {{ item }}</li>
        </ol>
      </div>
      <div>
        <h3>日漫排行榜</h3>
        <ol>
          <li v-for="(item, index) in ranking" :key="index">{{ index + 1 }}. {{ item }}</li>
        </ol>
      </div>
    </aside> -->

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import '@arco-design/web-vue/dist/arco.css';

export default defineComponent({
  name: 'Home',
  setup() {
    const images = ref([
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
    ]);

    const handleChange = (value: number) => {
      console.log('当前轮播页:', value);
    };

    const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
    const selectedDay = ref('周一');
    const ranking = ref(['作品1', '作品2', '作品3', '作品4', '作品5']);

    return {
      images,
      handleChange,
      days,
      selectedDay,
      ranking,
    };
  },
});
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #121212;
  color: white;
}
/* 顶部导航栏样式 */
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

/* 轮播图样式 */
.carousel {
  margin-bottom: 20px;
}

.weekly-update,
.latest-section {
  margin-bottom: 20px;
  text-align: center;
}
.video-list {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.video-card {
  background: #333;
  width: 180px;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
}
.video-thumbnail {
  background: #666;
  height: 130px;
  margin-bottom: 10px;
}
.ranking {
  margin-top: 20px;
}
</style>
