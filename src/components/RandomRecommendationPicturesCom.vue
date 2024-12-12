<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import request from '@/utils/request';
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
        const shuffled = animeList.value.sort(() => 0.36 - Math.random());//这里获取id(36)并随机抽取9个
        randomAnimeList.value = shuffled.slice(0, 9);
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

<template>
  <div class="tile-container">
    <div v-if="randomAnimeList.length > 0" class="tile-grid">
      <div v-for="anime in randomAnimeList" :key="anime.id" class="tile" @click="jumpToDetail(anime.id)">
        <img :src="getCoverUrl(anime.filePath[0]?.fileName || '')" alt="Cover Image" class="tile-image" />
        <div class="tile-overlay">
          <p class="tile-title">{{ anime.name }}</p>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.tile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 1200px;
}

.tile {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 10px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tile:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.8);
  transition: filter 0.3s;
}

.tile:hover .tile-image {
  filter: brightness(1);
}

.tile-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  text-align: center;
}

.tile-title {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}
</style>
