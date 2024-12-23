import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    serverUrl: 'http://localhost:8080',
  }),
});
