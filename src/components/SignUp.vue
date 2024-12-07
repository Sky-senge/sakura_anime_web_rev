<template>
  <div class="form">
    <h2>注册</h2>
    <label>用户名</label>
    <input type="text" v-model="registerData.username" placeholder="Username..." />
    <label>邮箱</label>
    <input type="mail" v-model="registerData.email" placeholder="Email (Musted)..." />
    <label>密码</label>
    <input type="password" v-model="registerData.password" placeholder="Password..." />
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
  var response = await request.post('/user/register', registerData.value)
  if (response.data.status) {
    ElMessage.success("注册成功，请登录！")
    router.push("/login")
  } else {
    if (response.data.error != null) {
      ElMessage.error(response.data.error)
    } else {
      ElMessage.error("注册失败，用户已重复或邮箱不正确！")
    }
  }
};
</script>

<style scoped>
.form {
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
  width: 75%;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 35px;
}

input {
  width: 80%;
  margin: 8px 0;
  padding: 12px;
  background-color: #eee;
  border: none;
  border-bottom: 1px solid #333;
  outline: none;
}

.forget-password {
  text-decoration: none;
  color: #787878;
  font-size: 0.8rem;
  margin: 20px 0;
}

.forget-password:hover {
  color: rgb(255, 47, 47);
}

button {
  cursor: pointer;
  background: #ff3b3b;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  color: white;
  margin-top: 12px;
  outline: none;
  font-weight: 800;
  letter-spacing: 4px;
  transition: all .3s;
}

button:hover {
  background-color: #d33418;
  transform: scale(1.01);
}

button:active {
  background-color: #e12200;
  transform: scale(0.98);
}
</style>
