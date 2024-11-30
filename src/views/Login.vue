<template>
  <div id="login">
    <div class="container" :class="{ active: isSignUp }">
      <component :is="currentComponent" class="form-container"></component>
      <div class="overlay_container">
        <div class="overlay">
          <div class="overlay_panel overlay_left_container">
            <h2>欢迎注册!</h2>
            <p>欢迎您注册本站</p>
            <el-button round color="#ffffff" @click="switchToSignIn" id="sign-in">登录</el-button>
          </div>
          <div class="overlay_panel overlay_right_container">
            <h2>欢迎回来~</h2>
            <p>尊敬的用户，请登录</p>
            <el-button round color="#ffffff" @click="switchToSignUp" id="sign-up">注册</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';


const isSignUp = ref(false);
const currentComponent = ref(SignIn);

const switchToSignUp = () => {
  isSignUp.value = true;
  currentComponent.value = SignUp;
};

const switchToSignIn = () => {
  isSignUp.value = false;
  currentComponent.value = SignIn;
};
</script>

<style lang="scss" scoped>
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f6f5f7;
}

h2 {
  margin-bottom: 10px;
  font-size: 32px;
  text-transform: capitalize;
}

.container {
  position: relative;
  width: 768px;
  height: 480px;
  background-color: white;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: white;
  transition: all 0.6s ease-in-out;
}

.form-container.active {
  transform: translateX(100%);
}

.overlay_container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 100;
  right: 0;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
}

.overlay {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -100%;
  background-color: #ff4b2b;
  transition: transform 0.6s ease-in-out;
}

.overlay_panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  color: white;
  text-align: center;
}

.overlay_panel button {
  background-color: transparent;
  border: 1px solid white;
  background-color: white;
}

.overlay_panel p {
  font-size: 12px;
  margin: 10px 0 15px 0;
}

.overlay_right_container {
  right: 0;
}

.container.active .overlay_container {
  transform: translateX(-100%);
}

.container.active .overlay {
  transform: translateX(50%);
}

.container.active .form-container {
  transform: translateX(100%);
}
</style>
