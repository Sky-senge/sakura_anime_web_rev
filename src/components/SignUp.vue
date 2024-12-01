<template>
  <div class="form">
    <h2>注册</h2>
    <input
      type="text"
      v-model="registerData.username"
      placeholder="Username..."
    />
    <input
      type="mail"
      v-model="registerData.email"
      placeholder="Email (Musted)..."
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
import request from '@/utils/request';


const registerData = ref({
  username: '',
  email: '',
  password: '',
});

const router = useRouter();


const signUp = async () => {
  var response=await request.post('/user/register', registerData.value)
  if(response.data.status){
    ElMessage.success("注册成功，请登录！")
    router.push("/login")
  }else{
    if(response.data.error!=null){
      ElMessage.error(response.data.error)
    }else{
      ElMessage.error("注册失败，用户已重复或邮箱不正确！")
    }
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
