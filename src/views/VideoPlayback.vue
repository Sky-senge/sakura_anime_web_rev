<template>
    <Navbar />
    <div class="video-wrapper">
        <Artplayer @get-instance="getInstance" :option="option" :style="style" />
        <!-- 选集区域 -->
        <div class="episode-selector">
            <h3>选集：</h3>
            <button v-for="(episode, index) in episodes" :key="index" @click="selectEpisode(index)" class="episode-btn">{{ episode.title }}</button>
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from '/src/components/navbar-component.vue';
import Artplayer from "/src/components/Artplayer.vue";

export default defineComponent({
    name: 'HomePage',
    data() {
        return {
            option: {
                url: "path/to/video.mp4",
                fullscreen: true,
            },
            style: {
                width: "1600px",
                height: "800px",
                margin: "60px auto 0",
            },
            // 模拟的选集数据，实际中可以从接口获取
            episodes: [
                { title: "第1集", videoUrl: "path/to/episode1.mp4" },
                { title: "第2集", videoUrl: "path/to/episode2.mp4" },
                { title: "第3集", videoUrl: "path/to/episode3.mp4" }
            ],
            // 模拟的评论数据，实际中可以从接口获取并更新
            comments: [],
            newComment: "",
            username: "匿名用户" // 这里可以改为登录后的真实用户名，比如从登录状态获取
        };
    },
    components: {
        Artplayer,
        Navbar,
    },
    methods: {
        getInstance(art) {
            console.info(art);
        },
        // 选集切换方法
        selectEpisode(index) {
            const selectedEpisode = this.episodes[index];
            this.option.url = selectedEpisode.videoUrl;
            // 这里可以根据ArtPlayer.js的API重新加载视频等操作，示例中暂未详细体现
        },
        // 添加评论的方法
        addComment() {
            if (this.newComment.trim()!== "") {
                this.comments.push({
                    username: this.username,
                    text: this.newComment
                });
                this.newComment = "";
            }
        }
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