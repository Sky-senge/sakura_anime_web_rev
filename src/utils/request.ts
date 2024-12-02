import axios from 'axios';
import { useUserStore } from '@/stores/user'; // 假设 Pinia store 放在 src/stores 目录下

const request = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  timeout: 5000,
});

// 请求拦截器：添加 Token 到请求头
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore(); // 获取 Pinia 的 user store
    const token = userStore.token || localStorage.getItem('token'); // 优先从 store 获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 设置 Token 到 Authorization 头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
