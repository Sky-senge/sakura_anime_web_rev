<template>
  <div class="video-wrapper">
    <!-- 视频播放器 -->
    <Artplayer @get-instance="getInstance" :option="option" :style="style" />
    <!-- 选集区域 -->
    <div class="episode-selector">
      <h3>选集：</h3>
      <button
        v-for="(episode, index) in episodes"
        :key="index"
        @click="selectEpisode(index)"
        class="episode-btn"
      >
        {{ episode.episode }}
      </button>
    </div>
    <!-- 评论区 -->
    <div class="comment-section">
      <h3>评论区</h3>
      <textarea v-model="newComment" placeholder="发表你的评论"></textarea>
      <button @click="addComment">发表评论</button>
      <ul>
        <li v-for="(comment, commentIndex) in comments" :key="commentIndex">
          <p><strong>{{ comment.username }}</strong>：{{ comment.text }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import Artplayer from '/src/components/Artplayer.vue';
import Hls from 'hls.js';
import { request } from '@/utils/request';

// 获取路由参数
const router = useRouter();
const route = useRoute();
const animeId = route.params.animeId as string;
const episode = route.params.episode as string;

// 定义响应式数据
const option = reactive({
  url: ``,
  fullscreen: true,
  type: 'm3u8',
  customType: {
    m3u8: function playM3u8(video: any, url: any, art: any) {
      if (Hls.isSupported()) {
        if (art.hls) art.hls.destroy();
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        art.hls = hls;
        art.on('destroy', () => hls.destroy());
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        art.notice.show = 'Unsupported playback format: m3u8';
      }
    },
  },
});
const style = reactive({
  width: "1600px",
  height: "800px",
  margin: "60px auto 0",
});
const episodes = ref([]);
const videoDetail = reactive({});
const comments = ref([]);
const newComment = ref("");
const username = ref("匿名用户");

// 保存Artplayer实例
const artPlayerInstance = ref<any>(null);

// 获取 Artplayer 实例
function getInstance(instance: any) {
  artPlayerInstance.value = instance;
  console.log('Artplayer 实例:', instance);
}

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
          episode: `第${file.episodes}集`,
          videoUrl: `http://localhost:8080/files/getVideo/${file.fileName}/playlist.m3u8`,
        };
      });
      // 如果 episodes 存在，默认设置为第一个视频
      if (episodes.value.length > 0) {
        option.url = episodes.value[0].videoUrl;
        EpisodeBuilder(Number(episode)-1);
      }
    } else {
      console.error('Failed to fetch video detail:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching video detail:', error);
  }
}

// 选择某一集视频
function selectEpisode(index: number) {
  const selectedEpisode = episodes.value[index];
  if (selectedEpisode) {
    option.url = selectedEpisode.videoUrl;
    console.log(`选中视频: ${selectedEpisode.episode}, URL: ${option.url}`);
    // 更新播放器，手动重新加载视频
    if (artPlayerInstance.value) {
      artPlayerInstance.value.url=option.url; // 直接调用Artplayer的load方法更新视频
      router.push(`/Videoplayback/${animeId}/${index+1}`)
    }
  }
}

// 初始化加载
function EpisodeBuilder(index: number) {
  const selectedEpisode = episodes.value[index];
  if (selectedEpisode) {
    option.url = selectedEpisode.videoUrl;
    console.log(`选中视频: ${selectedEpisode.episode}, URL: ${option.url}`);
    // 更新播放器，手动重新加载视频
    if (artPlayerInstance.value) {
      artPlayerInstance.value.url=option.url; // 直接调用Artplayer的load方法更新视频
    }
  }
}

// 添加评论
function addComment() {
  if (newComment.value.trim() !== "") {
    comments.value.push({
      username: username.value,
      text: newComment.value,
    });
    newComment.value = "";
  }
}

// 在组件挂载时获取视频详情
onMounted(() => {
  if (animeId) {
    fetchEpisodeList(animeId); // 调用获取视频列表的方法
  } else {
    console.error('animeId is missing');
  }
});
</script>


<style scoped>
.video-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.episode-selector {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.episode-btn {
    background-color: #0080ff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.episode-btn:hover {
    background-color: #333;
}

.comment-section {
    margin-top: 20px;
    height: 80%;
    width: 1600px;
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    /* padding: 5px; */
    resize: none;
}

button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

ul {
    list-style-type: none;
    padding: 0;
    margin-top: 10px;
}

li {
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
}
</style>