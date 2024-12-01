<template>
  <div class="form">
    <h2>登录</h2>
    <input
      type="text"
      v-model="loginData.username"
      placeholder="username..."
    />
    <input
      type="password"
      v-model="loginData.password"
      placeholder="Password..."
    />
    <a href="#" class="forget-password" @click="dialogVisible=true">忘记密码</a>
    <button @click="signIn">登录</button>
    <!-- 忘记密码的对话框 -->
    <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <span>请联络站点管理员。</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import  request  from '@/utils/request';

const userStore=useUserStore();
const dialogVisible=ref(false);

const loginData = ref({
  username: '',
  password: '',
});

const router = useRouter();

const signIn = async () => {
  console.log('Sign In:', loginData.value);
  var response=await request.post('/user/login', loginData.value)
  if(response.data.status){
    const {token, userId}= response.data.data
    userStore.setUser({token, userId})
    ElMessage.success("登录成功！")
    router.push('/') //登录成功后返回主页
  }else{
    ElMessage.error("登录失败！请检查用户名和密码。")
  }
};
const handleClose = ()=>{
  return null;
}
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

.forget-password {
  display: inline-block;
  height: 20px;
  text-decoration: none;
  color: #bbb;
  text-transform: capitalize;
  font-size: 12px;
}

.forget-password:hover {
  color: lightslategray;
  border-bottom: 2px solid #ff4b2b;
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
