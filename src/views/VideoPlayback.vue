<template>
  <div class="video-wrapper">
    <div class="middle">
      <div class="wrapper">
        <!-- 视频播放器 -->
        <Artplayer @get-instance="getInstance" ref="videoPlayerRef" :option="option" class="video" />
        <div class="right">
          <div class="episode">
            <div class="episode-title">选集播放</div>
            <div class="episode-selector">
              <button v-for="(episode, index) in episodes" :key="index" @click="selectEpisode(index)"
                class="episode-btn">
                {{ episode.episode }}
              </button>
            </div>
          </div>
          <!-- 视频推荐 -->
          <div class="lll">

          </div>
        </div>
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
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Artplayer from '/src/components/Artplayer.vue';
import Hls from 'hls.js';
import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';
import artplayerPluginLibass from 'artplayer-plugin-libass';
import { request } from '@/utils/request';

// 获取路由参数
const router = useRouter();
const route = useRoute();
const animeId = route.params.animeId as string;
const episode = route.params.episode as string;

// 创建对VideoPlayer子组件的引用
const videoPlayerRef = ref(null);

// 定义响应式数据
const option = reactive({
  url: ``,
  fullscreen: true,
  type: 'm3u8',
  plugins: [
    artplayerPluginLibass({
      // debug: true,
      workerUrl: 'https://unpkg.com/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.js',
      // wasmUrl: 'https://unpkg.com/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.wasm',
      fallbackFont: 'https://github.com/magiclen/source-han-sans-cn-woff2/raw/refs/heads/master/SourceHanSansCN-Bold.woff2'
    }),
  ],
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
  subtitle: {
    url: '',
  },
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
          episode: `${file.episodes}`,
          videoUrl: `http://localhost:8080/files/getVideo/${file.fileName}/playlist.m3u8`,
          subtitleUrl: `http://localhost:8080/files/getVideo/${file.fileName}/playlist.ass`
        };
      });
      // 如果 episodes 存在，默认设置为第一个视频
      if (episodes.value.length > 0) {
        option.url = episodes.value[0].videoUrl;
        option.subtitle.url = episodes.value[0].subtitleUrl;
        console.log("episodes.value")
        console.log(episodes.value)
        EpisodeBuilder(Number(episode) - 1);

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
    console.log("selectedEpisode")
    console.log(selectedEpisode)
    option.url = selectedEpisode.videoUrl;
    option.subtitle.url = selectedEpisode.subtitleUrl;
    console.log(`选中视频: ${selectedEpisode.episode}, URL: ${option.url}, 字幕URL: ${option.subtitle.url}`);
    // 更新播放器，手动重新加载视频
    if (artPlayerInstance.value) {
      // artPlayerInstance.value.url=option.url;
      videoPlayerRef.value.switchVideo(option.url) //调用切换方法
      videoPlayerRef.value.switchSubtitle(option.subtitle.url);
      router.push(`/Videoplayback/${animeId}/${index + 1}`)
    }
  }
}

// 初始化加载
function EpisodeBuilder(index: number) {
  const selectedEpisode = episodes.value[index];
  if (selectedEpisode) {
    option.url = selectedEpisode.videoUrl;
    option.subtitle.url = selectedEpisode.subtitleUrl;
    console.log(`选中视频: ${selectedEpisode.episode}, URL: ${option.url}, 字幕URL: ${option.subtitle.url}`);
    // 更新播放器，手动重新加载视频
    if (artPlayerInstance.value) {
      videoPlayerRef.value.switchVideo(option.url) //调用切换方法
      videoPlayerRef.value.switchSubtitle(option.subtitle.url);
      console.log(videoPlayerRef.value)
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
  background-color: #e2e4e8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.middle {
  width: 85%;
  padding: 20px 35px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.wrapper {
  margin-top: 20px;
  display: flex;
  gap: 50px;
}

.video {
  width: 800px;
  height: 500px;
}

.right {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
  justify-content: flex-start;
}

.episode{
  border-radius: 10px;
  padding: 30px;
  background-color: #e2e4e8;
}

.episode-title{
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.episode-selector {
  display: grid;
  gap: 15px;
  padding: 10px 20px;
  grid-template-columns: repeat(auto-fit, minmax(50px, 5fr));
  overflow-y: auto;
}

.episode-btn {
  background-color: #ff5811;
  color: white;
  border: none;
  padding: 8px 12px;
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