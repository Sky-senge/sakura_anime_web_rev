<template>
  <div id="login">
    <div class="container" :class="{ active: isSignUp }">
      <!-- 包裹在 transition 组件中，以便控制过渡动画 -->
      <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <component :is="currentComponent" class="form-container"></component>
      </transition>

      <!-- 切换按钮，分别控制注册与登录 -->
      <button v-if="isSignUp" class="d-btn" @click="switchToSignIn" id="sign-in">已有账号?点击登陆</button>
      <button v-if="!isSignUp" class="d-btn" @click="switchToSignUp" id="sign-up">没有账号?立即注册</button>
    </div>

    <div class="mask">
      <div class="text" :class="{ 'text-signup': isSignUp, 'text-signin': !isSignUp }">
        <h2>{{ isSignUp ? '欢迎注册' : '欢迎回来' }}😃</h2>
        <h1>{{ isSignUp ? '加入我们，开启新旅程！' : '欢迎回来，继续未完的冒险！' }}</h1>
      </div>
    </div>

    <video class="bgVideo" autoplay loop muted>
      <source src="https://wallpaper-static.cheetahfun.com/wallpaper/sites/dynamics/vm8.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';

const isSignUp = ref(false); // 控制是否为注册状态
const currentComponent = ref(SignIn); // 默认显示登录组件

// 切换到注册界面
const switchToSignUp = () => {
  isSignUp.value = true;
  currentComponent.value = SignUp; // 切换组件为注册界面
};

// 切换到登录界面
const switchToSignIn = () => {
  isSignUp.value = false;
  currentComponent.value = SignIn; // 切换组件为登录界面
};

// 过渡动画生命周期钩子
const beforeEnter = (el: HTMLElement) => {
  el.style.opacity = '0';

  el.style.transform = "scale(0.5)";
};

const enter = (el: HTMLElement, done: Function) => {
  el.offsetHeight; // trigger reflow to ensure transition starts
  el.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  el.style.opacity = '1';

  el.style.transform = "scale(1)";
  done(); // 动画结束后调用
};

const leave = (el: HTMLElement, done: Function) => {
  el.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  el.style.opacity = '0';

  el.style.transform = "scale(0.5)";
  done(); // 动画结束后调用
};
</script>

<style scoped>
#login {
  overflow: hidden;
  background-color: #f6f5f7;
}

.text {
  position: fixed;
  bottom: 30px;
  left: 20px;
}

.text h2 {
  font-size: 1.8rem;
}

.text h1 {
  letter-spacing: 6px;
  font-size: 2.4rem;
}

.d-btn {
  cursor: pointer;
  color: #fff;
  background: none;
  border: none;
  position: fixed;
  z-index: 88;
  bottom: 20%;
}

.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 8;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
}

.bgVideo {
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  z-index: -1;
  transition: transform 1.85s ease;
}

.bgVideo source {
  object-fit: fill;
}

.container {
  width: 40%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  right: 0;
}

/* 过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
