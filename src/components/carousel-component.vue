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
    // 定义轮播图数据
    const images = ref([
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp'
    ]);

    // 轮播图切换事件处理
    const handleChange = (value: number) => {
      console.log('当前轮播页:', value);
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
  gap: 15px;
  padding: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  background-color: #f2f4f8;
  margin: 0 auto;
  user-select: none;
  transition: all .3s;
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
