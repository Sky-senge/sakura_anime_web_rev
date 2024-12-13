import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    userId: null as number | null,
    isAdmin: false as boolean,
    username: '' as string,
    displayName: '' as string,
    email:'' as string,
    remarks: '' as string,
    avatar: '' as string
  }),
  actions: {
    setUser({ token, userId, isAdmin, username, displayName, email, remarks, avatar }: { token: string; userId: number; isAdmin: boolean; username: string; displayName: string ;email: string ;remarks: string; avatar: string}) {
      this.token = token
      this.userId = userId
      this.isAdmin = isAdmin
      this.username = username
      this.displayName = displayName
      this.email = email
      this.remarks = remarks
      this.avatar = avatar
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId.toString())
      localStorage.setItem('aXNBZG1pbj8=', isAdmin ? '1' : '0')
      localStorage.setItem('username', username);
      localStorage.setItem('displayName', displayName);
      localStorage.setItem('email', email);
      localStorage.setItem('remarks', remarks);
      localStorage.setItem('avatar', avatar);
    },
    loadUser() {
      this.token = localStorage.getItem('token') || ''
      this.userId = Number(localStorage.getItem('userId')) || null
      this.isAdmin = Boolean(Number(localStorage.getItem('aXNBZG1pbj8='))===1) || false
      this.username = localStorage.getItem('username') || '';
      this.displayName = localStorage.getItem('displayName') || '';
      this.email = localStorage.getItem('email') || '';
      this.remarks = localStorage.getItem('remarks') || '';
      this.avatar = localStorage.getItem('avatar') || '';
    },
    clearUser() {
      this.token = ''
      this.userId = null
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.setItem('aXNBZG1pbj8=','0')
      localStorage.removeItem('username');
      localStorage.removeItem('displayName');
      localStorage.removeItem('email');
      localStorage.removeItem('remarks');
      localStorage.removeItem('avatar');
    },
  },
})
