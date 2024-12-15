<template>
  <div class="filter-container">
    <div class="filter">
      <div class="f-title">筛选</div>
      <div v-for="(tab, index) in tabs" :key="index" :class="{ tabcontent: true, active: activeTab === tab.name }">
        <div v-if="tab.name === 'anime'">
          <div class="filter-wrapper">
            <div class="filter-section">
              <span class="filter-label">类型</span>
              <span v-for="(type, typeIndex) in types" :key="typeIndex"
                :class="{ 'filter-option': true, active: selectedType === type }" @click="selectedType = type">{{ type
                }}</span>
            </div>
            <div class="filter-section">
              <span class="filter-label">状态</span>
              <span v-for="(status, statusIndex) in completionStatuses" :key="statusIndex"
                :class="{ 'filter-option': true, active: selectedCompletionStatus === status }"
                @click="selectedCompletionStatus = status">{{ status }}</span>
            </div>
            <div class="filter-section">
              <span class="filter-label">地区</span>
              <span v-for="(region, regionIndex) in regions" :key="regionIndex"
                :class="{ 'filter-option': true, active: selectedRegion === region }"
                @click="selectedRegion = region">{{
                  region }}</span>
            </div>
            <div class="filter-section">
              <span class="filter-label">年份</span>
              <span v-for="(year, yearIndex) in years" :key="yearIndex"
                :class="{ 'filter-option': true, active: selectedYear === year }" @click="selectedYear = year">{{ year
                }}</span>
            </div>
            <div class="filter-section">
              <span class="filter-label">语言</span>
              <span v-for="(language, languageIndex) in languages" :key="languageIndex"
                :class="{ 'filter-option': true, active: selectedLanguage === language }"
                @click="selectedLanguage = language">{{ language }}</span>
            </div>
            <div class="filter-section">
              <span class="filter-label">字母</span>
              <span v-for="(letter, letterIndex) in letters" :key="letterIndex"
                :class="{ 'filter-option': true, active: selectedLetter === letter }"
                @click="selectedLetter = letter">{{
                  letter }}</span>
            </div>
            <button class="reset-button" @click="resetFilters">重新筛选</button>
          </div>
        </div>
      </div>
    </div>
    <div class="video">
      <div class="video-title">
        <div class="tab">
          <button v-for="(tab, index) in tabs" :key="index" :class="{ active: activeTab === tab.name }"
            @click="activeTab = tab.name">{{ tab.label }}</button>
        </div>
        <!-- 分页器 -->
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentPageChange" />
      </div>
      <div class="video-list">
        <div v-if="animeList.length == 0">
          <p style="font-weight:bold">无数据，请重新筛选</p>
        </div>
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
      <!-- 分页器 -->
      <!-- <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentPageChange" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Navbar from '/src/components/navbar-component.vue';
import request from '@/utils/request';
import router from '@/router';
import { ElMessage } from 'element-plus';


const animeList = ref<Anime[]>([]);
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

// 最后更新时间
const lastTableUpdateTimestap =ref<LTUTModel>(
  { 
    videoLastUpdate:'',
    userLastUpdate:'0',
    commentLastUpdate:''
  }
);
// 定义 lastTableUpdateTimestap 接口类型
interface LTUTModel{
  videoLastUpdate: string,
  userLastUpdate: string,
  commentLastUpdate: string
}

// 选项卡数据
const tabs = [
  // { name: 'selected', label: '已选' },
  { name: 'anime', label: '番剧' }
];
const activeTab = ref('anime');
// 总页数
const total = ref(0);
// 当前页
const currentPage = ref(1);

// 类型数据
const types = [
  '全部', '热血', '奇幻', '动作', '科幻', '喜剧', '治愈', '冒险', '后宫', '百合', '校园',
  '青春', '恋爱', '爱情', '日常', '搞笑', '推理', '悬疑', '机战', '运动', '战争', '战斗',
  '励志', '致郁', '经典', '史诗', '职场', '黑暗', '泡面番', '轻小说', '耽美', '其他'
];
const selectedType = ref('全部');

//完结状态数据
const completionStatuses = ['全部', '已完结', '连载中'];
const selectedCompletionStatus = ref('全部');

// 地区数据
const regions = ['全部', '日本', '大陆', '中国香港', '中国台湾', '韩国', '欧美', '其它'];
const selectedRegion = ref('全部');

// 年份数据
const years = [
  '全部', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015',
  '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2006', '2005', '2004'
];
const selectedYear = ref('全部');

// 语言数据
const languages = ['全部', '日语', '国语', '粤语', '英语', '韩语', '其它'];
const selectedLanguage = ref('全部');

// 字母数据
const letters = [
  '全部', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9'
];
const selectedLetter = ref('全部');

// 重置筛选方法
const resetFilters = () => {
  selectedType.value = '全部';
  selectedRegion.value = '全部';
  selectedYear.value = '全部';
  selectedLanguage.value = '全部';
  selectedCompletionStatus.value = '全部';
  selectedLetter.value = '全部';
};

/**
 * 获取动漫列表
 */
const fetchAnimeList = async () => {
  try {
    // 构造 tag 参数
    const tags = [];
    if (selectedType.value !== '全部') tags.push(selectedType.value);
    if (selectedRegion.value !== '全部') tags.push(selectedRegion.value);
    if (selectedYear.value !== '全部') tags.push(selectedYear.value);
    if (selectedLanguage.value !== '全部') tags.push(selectedLanguage.value);
    if (selectedLetter.value !== '全部') tags.push(selectedLetter.value);

    // 完结状态筛选逻辑
    if (selectedCompletionStatus.value !== '全部') {
      const isCompleted = selectedCompletionStatus.value === '已完结';

      // 如果选择了已完结，则要求动漫有"完结"标签
      // 如果选择了连载中，则不添加"完结"标签
      if (isCompleted) {
        tags.push('完结');
      }
    }

    const queryString = tags.length > 0
      ? tags.map(tag => `tag=${encodeURIComponent(tag)}`).join('&')
      : ''; //没有参数就不要查询这个了
    const tagsQueryUrl = `/anime/getAnimeListByTags?${queryString}&page=${currentPage.value}&size=21`;
    const tagsTotallyQueryUrl = `/anime/countAnimeListByTags?${queryString}&page=${currentPage.value}&size=21`;
    let url = `/anime/getAnimeList?page=${currentPage.value}&size=20`;
    let totalQUrl = '/anime/countAnimePage?size=20'
    if (tags.length > 0) {
      url = tagsQueryUrl //如果有tags，就把它转为tags查询，否则直接查询总表
      totalQUrl = tagsTotallyQueryUrl
    }
    //请求动漫列表数据
    const response = await request.get<{
      status: boolean;
      data: Anime[];
      message: string;
    }>(url);
    //请求动漫总数
    const responseTotalNum = await request.get<{
      status: boolean;
      data: number;
      message: string;
    }>(totalQUrl);
    if (responseTotalNum.data.status) { //查询总页数
      total.value = (responseTotalNum.data.data) * 10
    }
    if (response.data.status) {
      // 在前端额外过滤
      animeList.value = response.data.data.filter(anime => {
        if (selectedCompletionStatus.value === '全部') return true;
        if (selectedCompletionStatus.value === '已完结') {
          return anime.tags && anime.tags.some(tag => tag === '完结');
        }
        if (selectedCompletionStatus.value === '连载中') {
          return !anime.tags || !anime.tags.some(tag => tag === '完结');
        }
        return true;
      });

      console.log(animeList.value);
    } else {
      console.error('Failed to fetch anime list:', response.data.message);
    }
  } catch (error) {
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

/**
 * 根据动漫ID跳转到详情页
 * @param animeId - 动漫ID 
 */
const jumpToDetail = (animeId: number) => {
  router.push(`/Videoplayback/${animeId}/1`)
};

// 分页处理
const handleCurrentPageChange = (page: number) => {
  currentPage.value = page;
  fetchAnimeList();
};

const fetchLastUpdateTimestep = async () =>{
  try{ //获取最后更新的时间点的方法
    const response = await request.get('/getLastUpdate');
    if(response.data.status){
      const responseData = response.data.data
      lastTableUpdateTimestap.value.commentLastUpdate = responseData.commentLastUpdate;
      lastTableUpdateTimestap.value.videoLastUpdate = responseData.videoLastUpdate;
      console.log("最后更新数据")
      console.log(lastTableUpdateTimestap.value)
    }
  }catch(e){
    console.error(e);
    ElMessage.error("网络异常");
  }
}
// 监听筛选条件变化并重新获取动漫列表
watch([
  selectedType,
  selectedRegion,
  selectedYear,
  selectedLanguage,
  selectedCompletionStatus,
  selectedLetter
], fetchAnimeList);

onMounted(()=>{
  fetchAnimeList()
  // fetchLastUpdateTimestep() //获取最后更新的时间点
})
</script>

<style scoped>
/* 整体容器样式 */
.filter-container {
  padding: 20px;
  width: 84%;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
}

.filter {
  width: 24%;
}

.video {
  flex: 1;
}

.video-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 20px;
}

.f-title {
  margin: 20px;
  font-size: 1.2rem;
  font-weight: 800;
}

/* 选项卡样式 */
.tab {
  overflow: hidden;
}

.tab button {
  background-color: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px 10px;
  transition: all .3s;
  color: rgb(95, 95, 95);
}

.tab button.active {
  font-weight: 900;
  font-size: 1rem;
  color: #ff3700;
  border-bottom: 3px solid #ff5e00;
  ;
}

.tabcontent {
  display: none;
  padding: 6px 12px;
}

.tabcontent.active {
  display: block;
}

/* 新增筛选容器样式 */
.filter-wrapper {
  user-select: none;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

/* 筛选区域样式 */
.filter-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  margin-bottom: 20px;
}

.filter-label {
  font-size: 1.1rem;
  font-weight: 1000;
  letter-spacing: 1px;
  margin-right: 8px;
}

.filter-option {
  cursor: pointer;
  padding: 5px;
  font-size: 0.9em;
  font-weight: 400;
  color: #333;
  transition: all .3s;
}

.filter-option:hover {
  color: #ff5a5a;
  font-weight: 600;
}

.filter-option.active {
  color: rgb(255, 30, 30);
  font-weight: 800;
}

/* 重新筛选按钮样式 */
.reset-button {
  background: #e1e5ef;
  color: rgb(68, 68, 68);
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  cursor: pointer;
  margin-top: 12px;
  letter-spacing: 2px;
  font-weight: 600;
  transition: all .3s;
}

.reset-button:hover {
  color: #f2f4f8;
  background-color: #282828;
}

.reset-button:active {
  color: #f2f4f8;
  background-color: #222;
}

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

@media (max-width: 1000px) {
  .filter-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .filter {
    width: 100%;
  }

  .video {
    flex: 1;
    width: calc(100% - 40px);
  }

  .video-list {
    grid-template-columns: repeat(3, 1fr);
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
  padding: 20px 5px;
  font-size: 1em;
  color: #333;
  background: #fff;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-card:hover .video-name{
  background: #dadada;
}
</style>