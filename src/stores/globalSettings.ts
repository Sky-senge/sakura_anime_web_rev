import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    serverUrl: 'http://localhost:8080', // 在这里定义后端的URL
    resUrl:'' // CDN资源的链接，目前没用，留个接口
  }),
});
