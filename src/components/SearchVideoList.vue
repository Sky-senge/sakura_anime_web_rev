<template>
    <div class="video-list">
      <!-- 循环展示 animeList 中的每个视频 -->
      <div v-for="anime in animeList" :key="anime.id" class="video-card" @click="jumpToDetail(anime.id)">
        <div class="video-thumbnail">
          <!-- 如果 filePath 存在且有内容，展示封面图片 -->
          <img v-if="anime.filePath?.length > 0" :src="getCoverUrl(anime.filePath[0].fileName)" :alt="anime.name">
          <!-- 如果 filePath 不存在或为空，展示默认占位符 -->
          <div v-else class="no-cover">No cover</div>
        </div>
        <!-- 展示视频名称 -->
        <div class="video-name">{{ anime.name }}</div>
      </div>
    </div>
  </template>
  
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import request from '@/utils/request'; // 引入封装好的 request 模块
  import router from '@/router';
  
  // 定义 Anime 接口类型
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
    props: {
    animeList: {
      type: Array as () => Anime[],
      required: true
    }},
    setup() {
      // 定义响应式变量 animeList
      const animeList = ref<Anime[]>([]);
      //是否启用随机推荐模式
      const isEnableRandomRecommend = ref(false);
      //请求的长度参数，随机模式下会获取三倍数据用于roll
      const querySize = ref(12);
  
      /**
       * 获取动漫列表
       */
    //   const fetchAnimeList = async () => {
    //     try {
    //       if (isEnableRandomRecommend.value) {
    //         querySize.value = 36; //更大范围获取进行随机请求
    //       }
    //       const response = await request.get<{
    //         status: boolean;
    //         data: Anime[];
    //         message: string;
    //       }>(`/anime/getAnimeList?page=1&size=${querySize.value}`);
  
    //       if (response.data.status) {
    //         // 成功获取数据，赋值给 animeList
    //         if (isEnableRandomRecommend.value) {
    //           const shuffled = response.data.data.sort(() => 0.36 - Math.random());
    //           animeList.value = shuffled.slice(0, 12); //产生随机动漫列表
    //         } else {
    //           animeList.value = response.data.data;
    //         }
    //         console.log(animeList.value)
    //       } else {
    //         // 接口返回失败信息，打印日志
    //         console.error('Failed to fetch anime list:', response.data.message);
    //       }
    //     } catch (error) {
    //       // 捕获并处理请求错误
    //       console.error('Error fetching anime list:', error);
    //     }
    //   };
  
      /**
       * 根据文件名生成封面图片的完整 URL
       * @param fileName - 文件名
       * @returns 完整的封面 URL
       */
      const getCoverUrl = (fileName: string) => {
        return `http://localhost:8080/files/getCover/${fileName}`;
      };
  
      /**
       * 根据动漫ID跳转到详情页
       * @param animeId - 动漫ID 
       */
      const jumpToDetail = (animeId: number) => {
        router.push(`/Videoplayback/${animeId}/1`)
      };
      // 在组件挂载时调用 fetchAnimeList
    //   onMounted(fetchAnimeList);
  
      return {
        // animeList,
        getCoverUrl,
        jumpToDetail
      };
    },
  });
  </script>
  
  
  <style scoped>
/* Video List Part */
.video-list {
  display: grid;
  gap: 15px;
  padding: 20px;
  grid-template-columns: repeat(5, 1fr);
  background-color: #f2f4f8;
  margin: 0 auto;
  user-select: none;
  transition: all .3s;
}
  
  @media (max-width: 768px) {
    .video-list {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }
  
  .video-card {
    cursor: pointer;
    background: #ececec;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .video-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .video-thumbnail {
    width: 100%;
    height: 150px;
    overflow: hidden;
  }
  
  .video-thumbnail img {
    width: 100%;
    height: 100%;
    filter: brightness(0.8);
    object-fit: cover;
    transition: all .3s;
  }
  
  .video-card:hover .video-thumbnail img{
    transform: scale(1.2);
  }
  
  .video-name {
    padding: 12px 5px;
    font-size: 1rem;
    color: #333;
    background: #fff;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all .3s;
  }
  
  .video-card:hover .video-name{
    background: #dadada;
  }
  </style>