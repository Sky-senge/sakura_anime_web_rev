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

//实例化路由
const router = useRouter();
// 定义刷新状态
const refreshKey = ref(0);
const animationClass = ref('');

const playerStore = usePlayerStore();

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
  if(jumpTarget === null){
    return;
  }else{
    jumpTo(jumpTarget);
  }
}

onMounted(()=>{
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
