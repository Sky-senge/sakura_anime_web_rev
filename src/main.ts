// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import ArcoVue from '@arco-design/web-vue';
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css';


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(ArcoVue)

app.mount('#app')
