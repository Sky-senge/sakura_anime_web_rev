import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userId: null as number | null,
    isAdmin: false as boolean
  }),
  actions: {
    setUser({ token, userId, isAdmin }: { token: string; userId: number; isAdmin: boolean}) {
      this.token = token
      this.userId = userId
      this.isAdmin = isAdmin
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId.toString())
      localStorage.setItem('aXNBZG1pbj8=', isAdmin ? '1' : '0')
    },
    loadUser() {
      this.token = localStorage.getItem('token') || ''
      this.userId = Number(localStorage.getItem('userId')) || null
      this.isAdmin = Boolean(Number(localStorage.getItem('aXNBZG1pbj8='))===1) || false
    },
    clearUser() {
      this.token = ''
      this.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.setItem('aXNBZG1pbj8=','0')
    },
  },
})
