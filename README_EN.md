# sakura_anime_web Instructions

## Runtime Environment Requirements:

- **NodeJS v18** (LTS version)
- **npm v9.8** (Recommended, not mandatory)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Disable Vetur if installed).

## Type Support for `.vue` Files in TypeScript

TypeScript does not natively support type information for `.vue` files. To address this, we use `vue-tsc` instead of the `tsc` CLI for type checking. In the editor, [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) is required to enable TypeScript language service awareness for `.vue` files. Installing the Vite plugin is also recommended.

## Custom Configuration

Refer to the [Vite Configuration Reference](https://vite.dev/config/).

To configure the backend API URL, modify `./stores/globalSettings`:

```ts
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    serverUrl: 'http://localhost:8080', // Define the backend URL here
    resUrl: '' // CDN resource link, not currently used, reserved for future use
  }),
});
```

Additionally, configure the `vite.config.ts` file to set up a backend Proxy URL to resolve cross-origin issues:

```ts
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend Proxy URL
        changeOrigin: true,
      },
      '/files': {
        target: 'http://localhost:8080', // Backend Proxy URL
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

## Project Setup

```sh
npm install
```

### Run and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile, and Minify for Production

```sh
npm run build
```
