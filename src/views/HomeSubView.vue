<template>
  <!-- 推荐大图区域 -->
  <div class="banner">
    <Carousel />
  </div>
  <section class="video-section">
    <div class="section-header">
      <div class="title">
        <div class="dot"></div>
        <div class="title-name">随便看看</div>
      </div>
      <a href="javascript:void(0)" class="view-more" @click="refreshRecommendations"><i
          class="bi bi-arrow-clockwise"></i> 换一批</a>
    </div>
    <div class="random" :class="animationClass" @animationend="handleAnimationEnd">
      <RandomRecommendationPicturesCom :key="refreshKey" />
    </div>
    <div class="section-header">
      <div class="title">
        <div class="dot"></div>
        <div class="title-name">热门推荐</div>
      </div>
      <a href="javascript:void(0)" @click="jumpTo('/sort')" class="view-more">更多 <i class="bi bi-chevron-compact-right"></i></a>
    </div>
    <VideoList />
  </section>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import VideoList from '/src/components/video-list-component.vue';
import RandomRecommendationPicturesCom from '@/components/RandomRecommendationPicturesCom.vue';
import Carousel from '/src/components/carousel-component.vue';
// 引入样式
import '../assets/home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// 引入相关路由/store
import { useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/playerStore';
import { useTokenStatus } from '@/stores/token';
import { useUserStore } from '@/stores/user';

//实例化路由
const router = useRouter();
// 定义刷新状态
const refreshKey = ref(0);
const animationClass = ref('');

const playerStore = usePlayerStore();
const tokenStatus = useTokenStatus();
const userStore = useUserStore();

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

// 导航跳转方法
const jumpTo = (path) => {
  router.push(path)
}

const refererToPlay =()=>{
  const jumpTarget = playerStore.theWayTo;
  const isExpiredToken = tokenStatus.isTokenExpired;
  if(isExpiredToken === '1'){
    alert("登录已过期，请重新登陆")
    tokenStatus.clearTokenStatus();
    userStore.clearUser();
    location.reload()
  }
  if(jumpTarget === null){
    return;
  }else{
    jumpTo(jumpTarget);
  }
}

// 展示logo
const logoStyle = `font-size: 75px; font-weight: bold;
background: #FFB6C1 ; color: #d9526d;
text-shadow: 3px -3px #FFFFFF , -3px 3px 6px black;
padding: 8px 25px;`;

const showConsoleLogo = () =>{
  console.log(
    "%cSakura Anime🌸%c\n"
    ,logoStyle
  );
  console.log("Project Sorce: https://github.com/Radium-bit/sakura_anime_web\n"+
  "项目源码: https://github.com/Radium-bit/sakura_anime_web\n"+
  "Sakura_Anime_Web Copyright(C)2024 Radium-bit,MilkteaCat,Lunk,Sky_Sen.")
}

onMounted(()=>{
  showConsoleLogo()
  setTimeout(() => {
    refererToPlay();
  }, 300); // 延迟 确保playerStore已经加载
})
</script>

<style>
.random {
  height: 250px;
}

.slide-out {
  animation: slideOut 0.3s forwards;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-20%);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(20%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
