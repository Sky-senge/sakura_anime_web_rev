<template>
  <div class="video-list">
    <!-- 循环展示 animeList 中的每个视频 -->
    <div v-for="anime in animeList" :key="anime.id" class="video-card">
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
  setup() {
    // 定义响应式变量 animeList
    const animeList = ref<Anime[]>([]);

    /**
     * 获取动漫列表
     */
    const fetchAnimeList = async () => {
      try {
        const response = await request.get<{
          status: boolean;
          data: Anime[];
          message: string;
        }>('/anime/getAnimeList?page=1&size=18');

        if (response.data.status) {
          // 成功获取数据，赋值给 animeList
          animeList.value = response.data.data;
        } else {
          // 接口返回失败信息，打印日志
          console.error('Failed to fetch anime list:', response.data.message);
        }
      } catch (error) {
        // 捕获并处理请求错误
        console.error('Error fetching anime list:', error);
      }
    };

    /**
     * 根据文件名生成封面图片的完整 URL
     * @param fileName - 文件名
     * @returns 完整的封面 URL
     */
    const getCoverUrl = (fileName: string) => {
      return `http://localhost:8080/files/getCover/${fileName}`;
    };

    // 在组件挂载时调用 fetchAnimeList
    onMounted(fetchAnimeList);

    return {
      animeList,
      getCoverUrl,
    };
  },
});
</script>


<style scoped>
.video-list {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 卡片间距 */
  justify-content: center; /* 居中对齐 */
  max-width: 1200px; /* 最大宽度，防止太宽 */
  margin: 0 auto; /* 水平居中 */
}

.video-card {
  background: #333;
  width: calc(16.6% - 10px); /* 16.6% 确保一行最多放 6 个，减去 gap 的宽度 */
  max-width: 180px; /* 设置最大宽度，防止拉伸 */
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  flex-grow: 1; /* 允许在行内均匀分布 */
  box-sizing: border-box; /* 包括 padding */
}

.video-thumbnail {
  background: #666;
  height: 130px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 4px;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #333;
  color: #fff;
  font-size: 12px;
}

.video-name {
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
