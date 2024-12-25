# sakura_anime_web 运行说明

**If you are Looking for English ver. [Click here](./README_EN.md)**

## 运行环境需求：

NodeJS v18 (LTS版本)

npm v9.8 (建议，不强制)

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（并禁用 Vetur，如有）。

## `.vue` 文件在 TS 中的类型支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们用 `vue-tsc` 替代 `tsc` CLI 来进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 使 TypeScript 语言服务能够识别 `.vue` 文件的类型，并建议安装`Vite`插件。

## 自定义配置

请参阅 [Vite 配置参考](https://vite.dev/config/)。

关于后端API的地址配置需要改动`./stores/globalSettings`

```ts
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    serverUrl: 'http://localhost:8080', // 在这里定义后端的URL
    resUrl:'' // CDN资源的链接，目前没用，留个接口
  }),
});
```

另外需要配置`vite.config.ts`文件，配置后端ProxyURL以解决跨域问题

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端Proxy URL
        changeOrigin: true,
      },
      '/files': {
        target: 'http://localhost:8080',// 后端Proxy URL
        changeOrigin: true,
      }
    }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
```

## 项目设置

```sh
npm install
```

### 运行和热重载模式

```sh
npm run dev
```

### 类型检查、编译和压缩为生产模式代码

```sh
npm run build
```
