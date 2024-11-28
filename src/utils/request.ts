import axios from 'axios' // 1. 引入axios

// 2. 创建axios实例，设置请求的默认配置
const request = axios.create({
    baseURL: 'http://127.0.0.1:8080/api', // 3. 设置请求根路径
    timeout: 5000 // 4. 设置请求超时时间
});

// 5. 默认导出
export default request