import axios from 'axios';
import { useUserStore } from '@/stores/user'; 

//API 请求
const request = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  timeout: 5000,
});

// 请求拦截器：添加 Token 到请求头
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore(); // 获取 Pinia 的 user store
    const token = userStore.token || localStorage.getItem('token'); // 获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 设置 Token 到 Authorization 头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//文件请求
const fileRequest = axios.create({
  baseURL: 'http://127.0.0.1:8080/files', // 文件路径的根路径
  timeout: 5000,
});
//添加 Token 到文件路径
fileRequest.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token || localStorage.getItem('token');
    if (token) {
      // 在文件路径中添加 token 参数
      config.url = `${config.url}?token=${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { request, fileRequest };
export default request;