import { defineStore } from 'pinia';
const EMPTY_STR = ''; //Define empty string

export const useTokenStatus = defineStore('tokenStatus', {
  state: () => ({
    isTokenExpired: EMPTY_STR //检查Token是否过期的flag
    /**
     * <empty>: 无特殊情况
     * 1: Token已过期
     */
  }),
  actions: {
    setTokenStatus(status: string) {
      this.isTokenExpired = status;
    },
    clearTokenStatus(){
        this.isTokenExpired = EMPTY_STR;
    }
  },
});
