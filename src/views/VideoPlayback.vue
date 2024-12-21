<template>
  <div class="video-wrapper">
    <div class="middle">
      <div class="wrapper">
        <!-- 视频播放器 -->
        <div class="left">
          <Artplayer @get-instance="getInstance" ref="videoPlayerRef" :option="option" class="video" />
          <div class="tags">
            <span v-for="(tag, index) in filteredTags" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
          <!-- 评论区 -->
          <div class="comment-section">
            <div class="section-title">评论<div class="section-title2">评论</div>
            </div>
            <div class="textarea">
              <textarea v-model="newComment.content" placeholder="这里是评论区,不是无人区"></textarea>
              <button @click="addComment">发表评论</button>
            </div>
            <ul>
              <li v-for="(comment, commentIndex) in comments" :key="commentIndex">
                <p><strong>{{ comment.username }}</strong>：{{ comment.content }}
                  <el-button v-if="isAdmin" type="danger" text="danger" @click="deleteComment(comment.id)">删除评论</el-button>
                </p>
              </li>
            </ul>
            <!-- 分页器 -->
            <el-pagination background layout="prev, pager, next" :total="total"
              @current-change="handleCurrentPageChange" />
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
          <div class="video-info-recommmand">
            <div class="episode-title">相关推荐</div>
            <div class="info-recommand">
              <div class="random" :class="animationClass" @animationend="handleAnimationEnd">
                <RandomRecommendationVideoPlayback :key="refreshKey" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted, type Ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/playerStore';
import Artplayer from '/src/components/Artplayer.vue';
import RandomRecommendationVideoPlayback from '@/components/RandomRecommendationVideoPlayback.vue';
import Hls from 'hls.js';
import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';
import artplayerPluginLibass from 'artplayer-plugin-libass';
import { request } from '@/utils/request';
import { ElMessage } from 'element-plus';

// 获取路由参数
const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore();
const animeId = route.params.animeId as string;
const episode = route.params.episode as string;

// 创建对VideoPlayer子组件的引用
const videoPlayerRef = ref<InstanceType<typeof Artplayer> | null>(null);
//userStore实例化
const userStore = useUserStore();

// 是否为管理员状态
const isAdmin = ref(false);

const tagCategories = {
  状态: ['连载', '完结'],
  类型: ['热血', '奇幻', '动作', '科幻', '喜剧', '治愈', '冒险', '后宫', '百合', '校园', '青春', '恋爱', '爱情', '日常', '搞笑', '推理', '悬疑', '机战', '运动', '战争', '战斗', '励志', '致郁', '经典', '史诗', '职场', '黑暗', '泡面番', '轻小说', '耽美', '其他'],
  地区: ['日本', '大陆', '中国香港', '中国台湾', '韩国', '欧美'],
  年份: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2006', '2005', '2004']
};

// 计算 "类型" 标签
const filteredTags = computed(() => {
  const typeTags = tagCategories['类型']; // 获取 "类型" 标签
  return videoDetail.tags.filter(tag => typeTags.includes(tag)); // 仅显示属于 "类型" 的标签
});

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
const newComment = ref<Comment>({ animeId: -1, userId: -1, content: "" });
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

// 本次是否已经提交历史记录
const isRecordedHistory = ref(false)

// 获取 Artplayer 实例
function getInstance(instance: any) {
  artPlayerInstance.value = instance;
  playerStore.setPlayerInstance(instance) //设置到Pinia进行跨状态管理
  console.log('Artplayer 实例:', instance);
}

const handleClick = () =>{ // 当鼠标点击后，延迟一小会(等待Player初始化)然后获取是否在播
  let isPlaying=false;
  setTimeout(()=>{
    isPlaying = artPlayerInstance.value.playing;
    console.log("获取Artplayer播放状态"+isPlaying)
    if(isPlaying){
      if(!isRecordedHistory.value){
        userStore.loadUser();
        addPlayerHistoryRecord(Number(animeId),Number(episode),userStore.userId!)
        isRecordedHistory.value = true; //避免单个页面重复记录
      }
    }
  },300)
}

// 如果是播放的状态，刷新历史记录
const addPlayerHistoryRecord = async(animeId:number, episode:number, userId:number) =>{
  try{
    const payload={
      "userId": userId,
      "animeId": animeId,
      "episodes": episode
    }
    const response = await request.post('/user/createHistory',payload);
    if(response.data.status){
      console.log(`新增历史记录:${animeId},${episode},${userId}`)
    }
  }catch(e){
    console.error(`无法新增历史记录：${e}`)
  }
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

async function fetchCommentList(animeId: number, page: number) {
  const response = await request.get(`/comment/getCommentList/${animeId}?page=${page}&size=30`)
  if (response.data.status) {
    comments.value = response.data.data.map((item: { username: any; }) => ({
      ...item,
      username: item.username || '[匿名用户]',
    }));
    console.log(`更新评论区，动漫ID: ${animeId}`)
  }
}

// 获取评论区总页数
async function fetchTotalyCommentPageNumber(animeId: number) {
  const response = await request.get('/comment/countCommentPage', {
    params: {
      animeId: animeId,
      size: 30 //和上述fetchCommentList的size保持一致
    }
  });
  if (response.data.status) { // 如果收到是有响应的，那么赋值
    total.value = response.data.data;
  }
}

// 添加评论
async function addComment() {
  if (newComment.value.content.trim() !== "") {
    userStore.loadUser();
    newComment.value.userId = userStore.userId
    newComment.value.animeId = videoDetail.id
    const payload = newComment.value; //包含字段
    const response = await request.post(`/comment/addComment`, payload);
    if (response.data.status) {
      ElMessage.success('评论成功！');
      newComment.value.content = "";
      fetchCommentList(videoDetail.id, currentPage.value);
    } else {
      ElMessage.error(`评论失败！${response.data.error}`)
    }
    // comments.value.push({
    //   username: username.value,
    //   text: newComment.value,
    // });
    // newComment.value = "";
  }
}

const deleteComment = async(commentId: number) =>{
  const response = await request.get(`/comment/deleteComment/${commentId}`)
  if(response.data.status){
    ElMessage.success("删除评论成功！")
    fetchCommentList(videoDetail.id, currentPage.value);
  }else{
    ElMessage.error("删除评论失败！")
  }
}

const refreshKey = ref(0);
const animationClass = ref('');

// 触发动画的函数
const refreshRecommendations = () => {
  animationClass.value = 'slide-out'; // 触发向上离场动画
};

// 监听动画结束
const handleAnimationEnd = () => {
  if (animationClass.value === 'slide-out') {
    refreshKey.value += 1; // 更新内容
    animationClass.value = 'slide-in'; // 触发从底部进入动画
  } else {
    animationClass.value = ''; // 清除动画类名
  }
};

const resetTheWay = ()=>{
  playerStore.theWayTo = null; //确保跳转成功后就擦除
}

// 在组件挂载时获取视频详情
onMounted(() => {
  if (animeId) {
    userStore.loadUser()
    fetchEpisodeList(animeId); // 调用获取视频列表的方法
    resetTheWay(); //清空跳转方法
    if(userStore.isAdmin === true){
      isAdmin.value = true; //是管理员则设置状态
    }
    fetchCommentList(Number(animeId), 1); //获取评论列表,打开时默认显示第一页
    fetchTotalyCommentPageNumber(Number(animeId)) //获取评论总页数
    refreshRecommendations() //随机刷新为你推荐
    document.addEventListener('click', handleClick) //监听鼠标点击事件
  } else {
    console.error('animeId is missing');
  }
});

// 总页数
const total = ref(0);
// 当前页
const currentPage = ref(1);
// 分页处理
const handleCurrentPageChange = (page: number) => {
  currentPage.value = page; //更新当前评论页数字
  fetchCommentList(videoDetail.id, page)
};

//获取评论页数
// const CommentListPage = async () => {
//   try {
//     //获取评论标签页数据
//     const Commentaccordingly = await request.get('/comment/countCommentPage',{
//       params:{
//         page:,
//         size:,
//       },
//     });
//   }
// };
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
  width: 85%;
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
  width: 100%;
  height: 555px;
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

.info-recommand-V {
  margin-top: 12px;
  display: flex;
  justify-content: left;
  align-items: center;
  /* gap: 80%; */
  width: max-content;
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
  grid-template-columns: repeat(6, 1fr);
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

.tags {
  margin: 15px 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.tag {
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

.video-info-recommmand {
  user-select: none;
  margin-top: 30px;
  border-radius: 10px;
  padding: 20px;
  background-color: #e2e4e8;

}

.info-recommand {
  width: 100%;
  height: 600px;
  overflow-y: auto;
}
</style>