<template>
    <Navbar />
    <div class="container">
        <section class="anime-details">
            <!-- 头部区域，整合更多信息展示 -->
            <header class="header">
                <div class="left-header">
                    <div class="left-image-section"> <!-- 新增左边图片区域的容器 -->
                        <img :src="anime.poster" alt="Anime Poster" class="poster-image" />
                    </div>
                </div>
                <div class="right-header">
                    <div class="anime-info-wrapper"> <!-- 新增包裹详细信息的容器 -->
                        <div class="right-text-section"> <!-- 新增右边文字区域的容器 -->
                            <h1 class="anime-title">{{ anime.title }}</h1>
                            <div class="rating-favorite-container"> <!-- 新增的包裹评分和收藏的容器 -->
                                <div class="rating-and-favorite">
                                    <span class="rating-value">
                                        <strong>评分:</strong> {{ anime.rating }}
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
                                <p><strong>导演:</strong> <span class="director-value">{{ anime.director }}</span></p>
                                <p><strong>编剧:</strong> <span class="writer-value">{{ anime.writer }}</span></p>
                                <p><strong>年份:</strong> <span class="year-value">{{ anime.year }}</span></p>
                                <p><strong>类型:</strong> <span class="genres-value">{{ anime.genres.join(', ') }}</span>
                                </p>
                                <p><strong>地区:</strong> <span class="area-value">{{ anime.area }}</span></p>
                                <p><strong>语言:</strong> <span class="language-value">{{ anime.language }}</span></p>
                                <p><strong>时长:</strong> <span class="duration-value">{{ anime.duration }}</span></p>
                                <p><strong>上映:</strong> <span class="release-value">{{ anime.release }}</span></p>
                                <p><strong>更新:</strong> <span class="update-value">{{ anime.update }}</span></p>
                            </div>
                            <p><strong>简介:</strong> <span class="description-value">{{ anime.description }}</span></p>
                        </div>
                    </div>
                </div>
            </header>
            <section class="action-section">
                <el-button type="text" @click="generateQRCode">生成二维码</el-button>
                <el-button type="text" @click="reportAnime">举报</el-button>
            </section>
            <h2>剧集列表</h2>
            <section class="episode-list">
                <ul>
                    <li v-for="(episode, index) in anime.episodes" :key="index">
                        <a :href="'/videoplayback/' + anime.id + '/' + (index + 1)" @click="playEpisode(index)"
                            class="episode-link">
                            <span class="episode-number">第{{ index + 1 }}集</span>
                            <span class="episode-name">{{ episode.name }}</span>
                        </a>
                    </li>
                </ul>
            </section>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { ElMessage } from 'element-plus';

// 模拟动漫详情数据，根据图片展示的丰富信息进行对应字段添加
const anime = ref({
    id: 1,
    title: '灵武大陆',
    status: '43 - 五 - 10:00',
    director: '未知',
    writer: '未知',
    year: '2024',
    rating: '8.5',
    genres: ['热血', '奇幻'],
    area: '大陆',
    language: '国语',
    duration: '10分钟',
    release: '2024 - 07 - 26(中国大陆)',
    update: '2024 - 12 - 09 13:00',
    description: '灵武大陆，一个灵力和武魂并存的世界，灵修一念动山河，武者徒手摘天地，星辰储昔日天才辰，受尽他人冷遇。在一次生死搏斗中，辰天降下星辰，融入上古神器混沌之杖，在天武之力的作用下混沌之杖化为灵武双体。',
    poster: 'https://bpic.588ku.com/illus_water_img/23/04/28/02a2e05e7a97598924c60cece23b1723.jpg!/fw/750/quality/99/unsharp/true/compress/true',
    episodes: [
        { name: '第一集', videoUrl: '/videos/episode1.mp4' },
        { name: '第二集', videoUrl: '/videos/episode2.mp4' },
        // 更多剧集数据
    ]
});

// 控制收藏状态
const isFavorite = ref(false);

// 模拟添加到收藏夹的逻辑，实际应用中需对接后端接口
const addToFavorites = () => {
    // 将收藏状态设为已收藏
    isFavorite.value = true;
    // 弹出成功提示信息
    ElMessage.success('已添加到收藏夹');
};

// 生成二维码的功能函数，目前仅提示待开发，实际应用需添加具体逻辑
const generateQRCode = () => {
    ElMessage.info('二维码生成功能待开发，可添加相关逻辑');
    // 实际应用中可在此处添加生成二维码的具体逻辑，比如调用二维码生成库等
};

// 举报动漫的功能函数，目前仅提示确认操作，实际应用需添加具体举报逻辑
const reportAnime = () => {
    ElMessage.warning('确认要举报该动漫吗？');
    // 实际应用中可添加举报相关逻辑，如弹出确认框后提交举报信息到后端等
};

// 播放剧集的功能函数，目前仅提示即将播放，实际应用需添加播放视频相关逻辑
const playEpisode = (index) => {
    ElMessage.info(`即将播放第${index + 1}集，请稍候...`);
    // 实际应用中可在此处添加播放视频的相关逻辑，比如跳转到播放页面等
};
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