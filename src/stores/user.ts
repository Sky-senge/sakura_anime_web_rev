import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userId: null as number | null,
  }),
  actions: {
    setUser({ token, userId }: { token: string; userId: number }) {
      this.token = token
      this.userId = userId
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId.toString())
    },
    loadUser() {
      this.token = localStorage.getItem('token') || ''
      this.userId = Number(localStorage.getItem('userId')) || null
    },
    clearUser() {
      this.token = ''
      this.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    },
  },
})
