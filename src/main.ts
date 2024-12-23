// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ArcoVue from '@arco-design/web-vue';
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css';
import './assets/global.css' 




const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(ArcoVue)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component) //导入ElementPlus Icon图标库
  }

app.mount('#app')
