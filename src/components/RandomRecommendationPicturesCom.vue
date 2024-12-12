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
import { defineComponent, ref, onMounted } from 'vue';
import request from '@/utils/request'; // 引入封装好的 request 模块
import router from '@/router';

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
    //取得动漫列表前30个
    const fetchAnimeList = async () => {
      try {
        const response = await request.get<{
          status: boolean;
          data: Anime[];
          message: string;
        }>('/anime/getAnimeList?page=1&size=36');

        if (response.data.status) {
          animeList.value = response.data.data;
          pickRandomAnimes();
        } else {
          console.error('Failed to fetch anime list:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching anime list:', error);
      }
    };

    const pickRandomAnimes = () => {
      if (animeList.value.length > 0) {
        const shuffled = animeList.value.sort(() => 0.36 - Math.random());
        randomAnimeList.value = shuffled.slice(0, 4);
      }
    };

    const getCoverUrl = (fileName: string) => {
      return `http://localhost:8080/files/getCover/${fileName}`;
    };

    const jumpToDetail = (animeId: number) => {
      router.push(`/Videoplayback/${animeId}/1`);
    };

    onMounted(fetchAnimeList);

    return {
      animeList,
      randomAnimeList,
      getCoverUrl,
      jumpToDetail
    };
  },
});
</script>

<style scoped>
.video-list {
  display: grid;
  gap: 12px;
  padding: 20px;
  grid-template-columns: repeat(4, 1fr);
  background-color: #f2f4f8;
  margin: 0 auto;
  user-select: none;
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
  font-size: 0.85rem;
  color: #181818;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
