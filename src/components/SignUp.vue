<template>
  <div class="form">
    <h2>注册</h2>
    <input
      type="text"
      v-model="registerData.username"
      placeholder="Username..."
    />
    <input
      type="phone"
      v-model="registerData.phone"
      placeholder="Phone Number (Musted)..."
    />
    <input
      type="password"
      v-model="registerData.password"
      placeholder="Password..."
    />
    <button @click="signUp">注册</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { signupQuery,loginQuery } from '@/utils/query';
import { useUserStore } from '@/stores/counter';

const userStore=useUserStore();

const registerData = ref({
  username: '',
  password: '',
});

const router = useRouter();


const signUp = async () => {
  var response=await signupQuery(registerData.value);
  if(response){
    var loginResponse=await loginQuery(registerData.value); //注册完成后立即登录
    userStore.setUsername(registerData.value.username);
    userStore.setLoginStatus(true);
    userStore.setToken(loginResponse);
    ElMessage.success("注册成功！")
    router.push("/")
  }else{
    ElMessage.error("注册失败，用户已重复或手机号不正确")
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

input {
  width: 80%;
  margin: 8px 0;
  padding: 12px;
  background-color: #eee;
  border: none;
  outline: none;
}

button {
  background: #ff4b2b;
  padding: 10px 50px;
  border: 1px solid transparent;
  border-radius: 20px;
  text-transform: uppercase;
  color: white;
  margin-top: 10px;
  outline: none;
  transition: transform 80ms;
}

button:active {
  transform: scale(0.95);
}
</style>
