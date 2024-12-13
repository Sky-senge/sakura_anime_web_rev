<template>
  <div class="form">
    <h2>登录</h2>
    <label>用户名</label>
    <input type="text" v-model="loginData.username" placeholder="username..." />
    <label>密码</label>
    <input type="password" v-model="loginData.password" placeholder="Password..." />
    <a href="#" class="forget-password" @click="dialogVisible = true">忘记密码</a>
    <button @click="signIn">登录</button>
    <!-- 忘记密码的对话框 -->
    <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleClose">
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
import request from '@/utils/request';

const userStore = useUserStore();
const dialogVisible = ref(false);

const switchToSignUp = () => {
  isSignUp.value = true;
  currentComponent.value = SignUp;
};

const loginData = ref({
  username: '',
  password: '',
});

const router = useRouter();

const signIn = async () => {
  console.log('Sign In:', loginData.value);
  var response = await request.post('/user/login', loginData.value)
  if (response.data.status) {
    const { token, userId } = response.data.data
    var isAdmin = false;
    userStore.setUser({ token, userId, isAdmin}) //先作为正常用户写入Token
    var checkResponse = await request.get('/user/getDetail')
    if(checkResponse.data.status){
      if(checkResponse.data.data.permission===0){
        isAdmin = true;
        console.log("已设置管理员状态：",isAdmin)
        userStore.setUser({ token, userId, isAdmin}) //如果是管理员，那么更新为管理员状态
      }
    }
    ElMessage.success("登录成功！")
    router.push('/') //登录成功后返回主页
  } else {
    if (response.data.status !== null) {
      ElMessage.error("登录失败！" + response.data.error)
    }
  }
};
const handleClose = () => {
  return null;
}
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

h2{
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

button:hover{
  background-color: #d33418;
  transform: scale(1.01);
}

button:active {
  background-color: #e12200;
  transform: scale(0.98);
}
</style>
