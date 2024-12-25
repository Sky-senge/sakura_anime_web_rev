# sakura_anime_web 运行说明

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（并禁用 Vetur，如有）。

## `.vue` 文件在 TS 中的类型支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们用 `vue-tsc` 替代 `tsc` CLI 来进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 使 TypeScript 语言服务能够识别 `.vue` 文件的类型，并建议安装`Vite`插件。

## 自定义配置

请参阅 [Vite 配置参考](https://vite.dev/config/)。

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
