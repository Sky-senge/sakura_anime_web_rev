<template>
  <div class="video-wrapper">
    <div class="middle">
      <div class="wrapper">
        <!-- 视频播放器 -->
        <div class="left">
          <Artplayer @get-instance="getInstance" ref="videoPlayerRef" :option="option" class="video" />
          <div class="tags">
            <span v-for="(tag, index) in videoDetail.tags" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
          <!-- 评论区 -->
          <div class="comment-section">
            <div class="section-title">评论<div class="section-title2">评论</div></div>
            <div class="textarea">
              <textarea v-model="newComment.content" placeholder="这里是评论区,不是无人区"></textarea>
              <button @click="addComment" >发表评论</button>
            </div>
            <ul>
              <li v-for="(comment, commentIndex) in comments" :key="commentIndex">
                <p><strong>{{ comment.username }}</strong>：{{ comment.content }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="right">
          <div class="title-warp">
            <div class="dot"></div>
            <div class="title">{{ videoDetail.name }}</div>
          </div>
          <div class="info">
            <div class="releaseDate">{{ videoDetail.releaseDate }}</div>
            <div class="rating">评分: {{ videoDetail.rating }}</div>
          </div>
          <div class="description">{{ videoDetail.description }}</div>
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
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Artplayer from '/src/components/Artplayer.vue';
import Hls from 'hls.js';
import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';
import artplayerPluginLibass from 'artplayer-plugin-libass';
import { request } from '@/utils/request';
import { ElMessage } from 'element-plus';

// 获取路由参数
const router = useRouter();
const route = useRoute();
const animeId = route.params.animeId as string;
const episode = route.params.episode as string;

// 创建对VideoPlayer子组件的引用
const videoPlayerRef = ref<InstanceType<typeof Artplayer> | null>(null);
//userStore实例化
const userStore = useUserStore();

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
const comments = ref<commentResponse[]>([]);
const newComment = ref<Comment>({animeId:-1,userId:-1,content:""});
interface Comment {
  animeId: number | null,
  userId: number | null,
  content: string
}
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
interface commentResponse {
    id: number,
    animeId: number,
    userId: number,
    username: string,
    content: string,
    createAt: string
}
interface Episode {
  episode: string;
  videoUrl: string;
  subtitleUrl: string;
}
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

async function fetchCommentList(animeId:number) {
  const response = await request.get(`/comment/getCommentList/${animeId}?page=1&size=30`)
  if(response.data.status){
    comments.value = response.data.data.map((item: { username: any; }) => ({
        ...item,
        username: item.username || '[匿名用户]',
      }));
    console.log(`更新评论区，动漫ID: ${animeId}`)
  }
}

// 添加评论
async function addComment() {
  if (newComment.value.content.trim() !== "") {
    userStore.loadUser();
    newComment.value.userId = userStore.userId
    newComment.value.animeId = videoDetail.id
    const payload = newComment.value; //包含字段
    const response = await request.post(`/comment/addComment`,payload);
    if(response.data.status){
      ElMessage.success('评论成功！');
      fetchCommentList(videoDetail.id);
    }else{
      ElMessage.error(`评论失败！${response.data.error}`)
    }
    // comments.value.push({
    //   username: username.value,
    //   text: newComment.value,
    // });
    // newComment.value = "";
  }
}

// 在组件挂载时获取视频详情
onMounted(() => {
  if (animeId) {
    fetchEpisodeList(animeId); // 调用获取视频列表的方法
    fetchCommentList(Number(animeId)); //获取评论列表
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
  overflow-y: auto;
}

.middle {
  width: 80%;
  min-width: 1200px;
  padding: 20px 35px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.wrapper {
  margin-top: 20px;
  display: flex;
  gap: 40px;
}

.video {
  width: 900px;
  height: 500px;
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.right {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 35%;
}

.title-warp {
  margin: 15px 4px;
  gap: 4px;
  display: flex;
  align-items: center;
}

.dot {
  color: #ff7300;
  padding: 9px 3px;
  border-radius: 25px;
}

.title {
  margin: 4px;
  z-index: 8;
  color: #2c2f31;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 4px;
}

.info {
  margin-top: 12px;
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 12%;
}

.releaseDate {
  user-select: none;
  font-size: 0.95rem;
  font-weight: 600;
}

.rating {
  user-select: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ff9500;
}

.description {
  margin: 16px 0px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #606668;
  word-break: break-all;
  letter-spacing: 1.2px;
  line-height: 1.2rem;
  height: 80px;
  overflow-y: auto;
  transition: all .3s;
}

.episode {
  user-select: none;
  margin-top: 30px;
  border-radius: 10px;
  padding: 20px;
  background-color: #e2e4e8;
}

.episode-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.episode-selector {
  display: grid;
  gap: 16px;
  padding: 10px 12px;
  grid-template-columns: repeat(auto-fit, minmax(40px, 5fr));
  overflow-y: auto;
}

.episode-btn {
  background-color: #ff6421;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.episode-btn:hover {
  background-color: #ff0d00;
}

.tags{
  margin: 15px 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.tag{
user-select: none;
 border-radius: 8px;
 background: #dcdcdc;
 padding: 6px 12px;
 font-weight: 600;
}

.comment-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #e2e4e8;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.section-title {
  user-select: none;
  position: relative;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.section-title2 {
  user-select: none;
  position: absolute;
  font-size: 1.4rem;
  font-weight: 800;
  top: 10px;
  left: 15px;
  opacity: 0.3;
}

textarea {
  width: calc(100% - 20px);
  height: 60px;
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
  background: none;
  resize: none;
  padding: 8px;
  border-radius: 5px;
  border: none;
  outline: none;

}

.textarea {
  padding: 10px;
  border-radius: 8px;
  border: 5px solid transparent;
  transition: all .5s;
}

.textarea:hover {
  border: 5px solid #ccc;
}

button {
  padding: 8px 14px;
  background-color: #000;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #535353;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

li {
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
color: #666;
}
</style>