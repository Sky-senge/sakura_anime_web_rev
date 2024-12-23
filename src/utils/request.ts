import axios from 'axios';
import { useUserStore } from '@/stores/user'; 
import { useGlobalStore } from '@/stores/globalSettings';

//API 请求
const request = axios.create({
  baseURL: 'NullURL',
  timeout: 5000,
});

// 请求拦截器：添加 Token 到请求头
request.interceptors.request.use(
  (config) => {
    const globalSettings = useGlobalStore(); // 从全局设置加载后端URL
    const serverUrl = globalSettings.serverUrl;
    config.baseURL = `${serverUrl}/api`
    const userStore = useUserStore(); // 获取 Pinia 的 user store
    userStore.loadUser(); //命令userStore加载用户
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
  baseURL: 'NullURL', // 文件路径的根路径
  timeout: 0, //因为暂时没写流响应，只能停用超时的方式进行上传
});
//添加 Token 到文件路径
fileRequest.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    userStore.loadUser(); //命令userStore加载用户
    const globalSettings = useGlobalStore(); // 从全局设置加载后端URL
    const serverUrl = globalSettings.serverUrl;
    config.baseURL = `${serverUrl}/files`
    const token = userStore.token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 设置 Token 到 Authorization 头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { request, fileRequest };
export default request;