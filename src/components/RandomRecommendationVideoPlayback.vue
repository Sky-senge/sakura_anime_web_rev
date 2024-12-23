<template>
    <div v-if="randomAnimeList.length > 0" class="video-list">
      <div v-for="anime in randomAnimeList" :key="anime.id" class="video-card" @click="jumpToDetail(anime.id)">
        <div class="video-thumbnail">
          <!-- 如果 filePath 存在且有内容，展示封面图片 -->
          <img v-if="anime.filePath?.length > 0" :src="getCoverUrl(anime.filePath[0].fileName)" :alt="anime.name">
          <!-- 如果 filePath 不存在或为空，展示默认占位符 -->
          <div v-else class="no-cover">No cover</div>
        </div>
        <p class="video-name">{{ anime.name }}</p>
      </div>
    </div>
  </template>
  
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, inject } from 'vue';
  import request from '@/utils/request'; // 引入封装好的 request 模块
  import router from '@/router';

  // 使用 inject 获取从App.vue提供的 serverUrl，并声明类型
const serverUrl = inject<string>('serverUrl');
  
  interface Anime {
    id: number;
    name: string;
    tags: string[];
    description: string;
    rating: number;
    releaseDate: string;
    filePath: { episodes: number; fileName: string }[];
  }
  
  export default defineComponent({
    name: 'VideoList',
    setup() {
      const animeList = ref<Anime[]>([]);
      const randomAnimeList = ref<Anime[]>([]);
      const randomCount = ref(6);  // 默认选择4个动漫
  
      // 取得动漫列表前36个
      const fetchAnimeList = async () => {
        try {
          const response = await request.get<{
            status: boolean;
            data: Anime[];
            message: string;
          }>('/anime/getAnimeList?page=1&size=36');
  
          if (response.data.status) {
            animeList.value = response.data.data;
            pickRandomAnimes();  // 获取随机动漫
          } else {
            console.error('Failed to fetch anime list:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching anime list:', error);
        }
      };
  
      // Fisher-Yates 洗牌算法 - 高效且公平的打乱数组
      const shuffleArray = (array: Anime[]) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // 交换元素
        }
        return shuffledArray;
      };
  
      // 随机选择动漫
      const pickRandomAnimes = () => {
        if (animeList.value.length > 0) {
          const shuffled = shuffleArray(animeList.value); // 打乱列表
          randomAnimeList.value = shuffled.slice(0, randomCount.value); // 取前 randomCount 个
        }
      };
  
      // 获取封面 URL
      const getCoverUrl = (fileName: string) => {
        return `${serverUrl}/files/getCover/${fileName}`;
      };
  
      // 跳转到详情页面
      const jumpToDetail = (animeId: number) => {
        router.push(`/Videoplayback/${animeId}/1`);
      };
  
      onMounted(fetchAnimeList);
  
      return {
        animeList,
        randomAnimeList,
        getCoverUrl,
        jumpToDetail,
        randomCount  // 如果希望动态调整随机数量，可以绑定到 UI 上
      };
    },
  });
  </script>
  
  
  <style scoped>
  .video-list {
    display: grid;
    gap: 12px;
    padding: 20px;
    padding-left: 35px;
    padding-right: 20px;
    grid-template-columns: repeat(2, 1fr);
    background-color: #f0f2f8;
    margin: 0 auto;
    user-select: none;
    border-radius: 10px;
    transition: all .3s;
  }
  
  .video-card {
    cursor: pointer;
    overflow: hidden;
  }
  
  .video-thumbnail {
    width: 100%;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    transform: scale(0.95);
    transition: all .2s;
    background: #ececec;
  }
  
  .video-thumbnail:hover {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(4, 100, 255, 0.2);
  }
  
  .video-thumbnail img {
    width: 100%;
    height: 100%;
    filter: brightness(0.8);
    object-fit: cover;
  }
  
  .video-name {
    margin-top: 5px;
    font-size: 0.85rem;
    color: #181818;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  