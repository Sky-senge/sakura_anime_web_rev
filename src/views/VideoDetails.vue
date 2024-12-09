<template>
    <Navbar />
    <div class="container">
      <div class="anime-details">
        <!-- 头部区域，整合更多信息展示 -->
        <div class="header">
          <div class="left-header">
            <h1 class="anime-title">{{ anime.title }}</h1>
            <div class="status-info">
              <span class="status-label">状态：</span>
              <span class="status-value">{{ anime.status }}</span>
            </div>
          </div>
          <div class="right-header">
            <div class="rating-and-favorite">
              <span class="rating-value">
                <strong>评分:</strong> {{ anime.rating }}
                <i class="el-icon-star-on" :style="{ color: '#ff9800' }"></i>
              </span>
              <el-button
                type="primary"
                class="favorite-button"
                @click="addToFavorites"
                :disabled="isFavorite"
              >
                <i class="el-icon-heart" :class="{ 'is-favorite': isFavorite }"></i>
                <span v-if="isFavorite">已收藏</span>
                <span v-else>收藏</span>
              </el-button>
            </div>
          </div>
        </div>
        <img :src="anime.poster" alt="Anime Poster" class="poster-image" />
        <div class="info-section">
          <p><strong>导演:</strong> <span class="director-value">{{ anime.director }}</span></p>
          <p><strong>编剧:</strong> <span class="writer-value">{{ anime.writer }}</span></p>
          <p><strong>年份:</strong> <span class="year-value">{{ anime.year }}</span></p>
          <p><strong>类型:</strong> <span class="genres-value">{{ anime.genres.join(', ') }}</span></p>
          <p><strong>地区:</strong> <span class="area-value">{{ anime.area }}</span></p>
          <p><strong>语言:</strong> <span class="language-value">{{ anime.language }}</span></p>
          <p><strong>时长:</strong> <span class="duration-value">{{ anime.duration }}</span></p>
          <p><strong>上映:</strong> <span class="release-value">{{ anime.release }}</span></p>
          <p><strong>更新:</strong> <span class="update-value">{{ anime.update }}</span></p>
          <p><strong>简 介:</strong> <span class="description-value">{{ anime.description }}</span></p>
        </div>
        <div class="action-section">
          <el-button type="text" @click="shareAnime">分享到</el-button>
          <el-button type="text" @click="generateQRCode">生成二维码</el-button>
          <el-button type="text" @click="reportAnime">举报</el-button>
        </div>
        <h2>剧集列表</h2>
        <div class="episode-list">
          <ul>
            <li v-for="(episode, index) in anime.episodes" :key="index">
              <a
                :href="'/videoplayback/' + anime.id + '/' + (index + 1)"
                @click="playEpisode(index)"
                class="episode-link"
              >
                <span class="episode-number">第{{ index + 1 }}集</span>
                <span class="episode-name">{{ episode.name }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Navbar from '/src/components/navbar-component.vue';
  import { ElButton } from 'element-plus';
  import { ElMessage } from 'element-plus';
  
  // 模拟动漫详情数据，根据图片展示的丰富信息进行对应字段添加
  const anime = ref({
    id: 1,
    title: '灵武大陆',
    status: '43 - 五 - 10:00',
    director: '未知',
    writer: '未知',
    year: '2024',
    rating: '8.5',
    genres: ['热血', '奇幻'],
    area: '大陆',
    language: '国语',
    duration: '10分钟',
    release: '2024 - 07 - 26(中国大陆)',
    update: '2024 - 12 - 09 13:00',
    poster: 'https://bpic.588ku.com/illus_water_img/23/04/28/02a2e05e7a97598924c60cece23b1723.jpg!/fw/750/quality/99/unsharp/true/compress/true',
    description: '灵武大陆，一个灵力和武魂并存的世界，灵修一念动山河，武者徒手摘天地，星辰储昔日天才辰，受尽他人冷遇。在一次生死搏斗中，辰天降下星辰，融入上古神器混沌之杖，在天武之力的作用下混沌之杖化为灵武双体。',
    episodes: [
      { name: '第一集', videoUrl: '/videos/episode1.mp4' },
      { name: '第二集', videoUrl: '/videos/episode2.mp4' },
      // 更多剧集数据
    ]
  });
  
  // 控制收藏状态
  const isFavorite = ref(false);
  
  // 模拟添加到收藏夹的逻辑，实际应用中需对接后端接口
  const addToFavorites = () => {
    isFavorite.value = true;
    ElMessage.success('已添加到收藏夹');
  };
  
  const shareAnime = () => {
    // 这里可以添加具体的分享逻辑，比如调用社交媒体分享接口或者生成分享链接等
    console.log('分享动漫功能待完善，可添加具体分享逻辑');
  };
  
  const generateQRCode = () => {
    ElMessage.info('二维码生成功能待开发，可添加相关逻辑');
    // 实际应用中可在此处添加生成二维码的具体逻辑，比如调用二维码生成库等
  };
  
  const reportAnime = () => {
    ElMessage.warning('确认要举报该动漫吗？');
    // 实际应用中可添加举报相关逻辑，如弹出确认框后提交举报信息到后端等
  };
  
  const playEpisode = (index) => {
    ElMessage.info(`即将播放第${index + 1}集，请稍候...`);
    // 实际应用中可在此处添加播放视频的相关逻辑，比如跳转到播放页面等
  };
  </script>
  
  <style scoped>
  .anime-details {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .left-header {
    display: flex;
    flex-direction: column;
  }
  
  .anime-title {
    font-size: 24px;
    text-align: left;
    margin-bottom: 5px;
  }
  
  .status-info {
    font-size: 14px;
    color: #666;
  }
  
  .status-label {
    margin-right: 5px;
  }
  
  .right-header {
    display: flex;
    align-items: center;
  }
  
  .rating-and-favorite {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .rating-value {
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  
  .favorite-button {
    border-radius: 4px;
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .favorite-button:hover {
    background-color: #f0f0f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .is-favorite {
    color: #ff4d4f;
  }
  
  .poster-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  
  .info-section {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .info-section p {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .director-value,
  .writer-value,
  .year-value,
  .genres-value,
  .area-value,
  .language-value,
  .duration-value,
  .release-value,
  .update-value,
  .description-value {
    margin-left: 5px;
  }
  
  .action-section {
    display: flex;
    justify-content: flex-start;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .episode-list {
    border-top: 1px solid #e0e0e0;
    padding-top: 15px;
  }
  
  .episode-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .episode-link:hover {
    background-color: #f5f5f5;
  }
  
  .episode-number {
    font-weight: bold;
    margin-right: 5px;
  }
  
  .episode-name {
    color: #666;
    flex: 1;
  }
  </style>