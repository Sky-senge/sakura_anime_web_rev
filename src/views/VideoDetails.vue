<template>
    <Navbar />
    <div class="container">
        <section class="anime-details">
            <!-- 头部区域，整合更多信息展示 -->
            <header class="header">
                <div class="left-header">
                    <div class="left-image-section"> <!-- 新增左边图片区域的容器 -->
                        <img :src="getCoverUrl()" alt="Anime Poster" class="poster-image" />
                    </div>
                </div>
                <div class="right-header">
                    <div class="anime-info-wrapper"> <!-- 新增包裹详细信息的容器 -->
                        <div class="right-text-section"> <!-- 新增右边文字区域的容器 -->
                            <h1 class="anime-title">{{ videoDetail.name }}</h1>
                            <div class="rating-favorite-container"> <!-- 新增的包裹评分和收藏的容器 -->
                                <div class="rating-and-favorite">
                                    <span class="rating-value">
                                        <strong>评分:</strong> {{ videoDetail.rating }}
                                        <i class="el-icon-star-on" :style="{ color: '#ff9800' }"></i>
                                    </span>
                                    <el-button type="primary" class="favorite-button" @click="addToFavorites"
                                        :disabled="isFavorite">
                                        <i class="el-icon-heart" :class="{ 'is-favorite': isFavorite }"></i>
                                        <span v-if="isFavorite">已收藏</span>
                                        <span v-else>收藏</span>
                                    </el-button>
                                </div>
                            </div>
                            <div class="info-section">
                                <!-- <p><strong>导演:</strong> <span class="director-value">{{ anime.director }}</span></p> -->
                                <!-- <p><strong>编剧:</strong> <span class="writer-value">{{ anime.writer }}</span></p> -->
                                <p><strong>年份:</strong> <span class="year-value">{{ videoDetail.releaseDate }}</span></p>
                                <p><strong>类型:</strong> <span class="genres-value">{{ videoDetail.tags.join(', ') }}</span>
                                </p>
                                <!-- <p><strong>地区:</strong> <span class="area-value">{{ anime.area }}</span></p> -->
                                <!-- <p><strong>语言:</strong> <span class="language-value">{{ anime.language }}</span></p> -->
                                <!-- <p><strong>时长:</strong> <span class="duration-value">{{ anime.duration }}</span></p> -->
                                <p><strong>上映:</strong> <span class="release-value">{{ videoDetail.releaseDate }}</span></p>
                                <!-- <p><strong>更新:</strong> <span class="update-value">{{ anime.update }}</span></p> -->
                            </div>
                            <p><strong>简介:</strong> <span class="description-value">{{ videoDetail.description }}</span></p>
                        </div>
                    </div>
                </div>
            </header>
            <section class="action-section">
                <!-- <el-button type="text" @click="generateQRCode">生成二维码</el-button> -->
                <el-button type="text" @click="reportAnime">举报</el-button>
            </section>
            <h2>剧集列表</h2>
            <section class="episode-list">
                <ul>
                    <li v-for="(episode, index) in episodes" :key="index">
                        <a href="javascript:void(0)" @click="playEpisode(index)"
                            class="episode-link">
                            <span class="episode-number">第{{ index + 1 }}集</span>
                            <!-- 没有名字数据，所以注释掉吧 -->
                            <!-- <span class="episode-name">{{ episode.name }}</span> -->
                        </a>
                    </li>
                </ul>
            </section>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, type Ref } from 'vue';
import { ElButton, ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useRoute,useRouter } from 'vue-router';
import request from '@/utils/request';
import { useGlobalStore } from '@/stores/globalSettings';

const route=useRoute();
const router=useRouter();
//获取路由参数
const animeId = route.params.animeId as string;

// 获取来自GlobalSettings提供的 serverUrl
const globalStore = useGlobalStore();
const serverUrl = globalStore.serverUrl;

const episodes: Ref<Episode[]> = ref([]);
const videoDetail = reactive<Video>({
  id: 0,
  name: '',
  tags: [],
  description: '',
  rating: 0,
  releaseDate: '',
  filePath: []
});

interface Video {
  id: number;
  name: string;
  tags: string[];
  description: string;
  rating: number;
  releaseDate: string;
  filePath: {
    episodes: number;
    fileName: string;
  }[];
}

interface Episode {
  episode: string;
  videoUrl: string;
  subtitleUrl: string;
}

// 控制收藏状态
const isFavorite = ref(false);

// 模拟添加到收藏夹的逻辑，实际应用中需对接后端接口
const addToFavorites = () => {
    // 将收藏状态设为已收藏
    isFavorite.value = true;
    // 弹出成功提示信息
    ElMessage.success('已添加到收藏夹');
};

// 导航跳转方法
const jumpTo = (path: string) => {
  router.push(path)
}

// 举报动漫的功能方法
const reportAnime = () => {
    ElMessageBox.confirm(
    "确定要举报该动漫吗？",
    '警告',
    {
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning',
    }
  ).then(()=>{
    ElMessageBox.alert('举报成功！感谢您对网络环境作出的净化','举报结果',{
        confirmButtonText:'好',
    })
  })
};

// 播放剧集的功能函数，目前仅提示即将播放，实际应用会使用路由跳转
const playEpisode = (index: number) => {
    ElMessage.info(`即将播放第${index + 1}集，请稍候...`);
    const url='/videoplayback/' + videoDetail.id + '/' + (index + 1)
    jumpTo(url)
};

// 获取动漫列表并更新视频信息
async function fetchEpisodeList(animeId: string) {
  try {
    const response = await request.get(`/anime/getDetail/${animeId}`);
    if (response.data.status) {
      // 更新 videoDetail 数据
      Object.assign(videoDetail, response.data.data);
      console.log("更新VideoDetail")
      // 从 videoDetail 中提取 filePath，生成 episodes 列表
      const filePathList = videoDetail.filePath;
      episodes.value = filePathList.map((file: any) => {
        return {
          episode: `${file.episodes}`,
          videoUrl: `${serverUrl}/files/getVideo/${file.fileName}/playlist.m3u8`,
          subtitleUrl: `${serverUrl}/files/getVideo/${file.fileName}/playlist.ass`
        };
      });
    } else {
      console.error('Failed to fetch video detail:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching video detail:', error);
  }
}

/**
 * 自动生成封面图片的完整 URL
 * @returns 完整的封面 URL
 */
const getCoverUrl = () => {
const fileObj = videoDetail.filePath.find(item => item.episodes === 1);
const fileName = fileObj?.fileName || 'default';
return `${serverUrl}/files/getCover/${fileName}`;
};

onMounted(()=>{
    fetchEpisodeList(animeId);
})
</script>

<style scoped>
/* 整体页面背景优化 */
body {
    background-color: #f8f9fa;
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
}

.anime-details {
    padding: 8%;
    max-width: 1440px;
    margin: 0 auto;
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
    width: 60%;
}

.anime-title {
    font-size: 32px;
    text-align: left;
    margin-bottom: 10px;
    letter-spacing: 2px;
    text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.15);
    font-weight: bold;
    color: #333;
}

.right-header {
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.rating-favorite-container {
    width: 100%;
    display: flex;
    justify-content: flex-end; /* 设置容器内元素靠右对齐 */
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

.rating-value i.el-icon-star-on {
    font-size: 18px;
}

.favorite-button {
    border-radius: 4px;
    transition: background-color 0.3s, box-shadow 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: #333;
}

.favorite-button:hover {
    background-color: #f0f0f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #000;
}

.favorite-button:active {
    background-color: #e0e0e0;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.is-favorite {
    color: #ff4d4f;
}

.anime-info-wrapper {
    display: flex;
    align-items: flex-start;
}

.poster-image {
    width: 450px;
    height: 550px;
    border: 1px solid #ccc;
    transition: opacity 0.3s;
    margin-right: 15px;
    overflow: hidden;
    background-position: 50% 50%;
    background-size: cover;
}

.poster-image:hover {
    opacity: 0.9;
}

.info-section {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-section p {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.info-section p strong {
    font-weight: bold;
    min-width: 80px;
}

.year-value {
    color: #333;
}

.genres-value {
    color: #007bff;
}

.action-section {
    display: flex;
    justify-content: flex-start;
    gap: 25px;
    margin-bottom: 15px;
}

.action-section button {
    font-size: 14px;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
    padding: 5px 10px;
}

.action-section button:hover {
    background-color: #e0e0e0;
    color: #000;
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
    transition: background-color 0.3s, color 0.3s, text-decoration 0.3s;
}

.episode-link:hover {
    background-color: #f5f5f5;
    color: #007bff;
    text-decoration: underline;
}

.episode-number {
    font-weight: bold;
    margin-right: 5px;
    font-family: Arial, sans-serif;
    border-radius: 3px;
    padding: 3px 8px;
    background-color: #f0f0f0;
    font-size: 16px;
    color: #555;
}

.episode-name {
    color: #777;
    flex: 1;
    font-size: 14px;
}
</style>