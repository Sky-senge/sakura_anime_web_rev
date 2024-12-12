<template>
  <div ref="artRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type PropType } from 'vue';
import Artplayer from 'artplayer';
import artplayerPluginLibass from 'artplayer-plugin-libass';
// 定义接收的 props
const props = defineProps({
  option: {
    type: Object as PropType<{
      url: string; // 必需的播放地址
      fullscreen?: boolean; // 是否启用全屏模式
      type?: string; // 播放类型，比如 'm3u8'
      plugins?: Array<(art: any) => any>; // 插件列表
      customType?: Record<string, (video: HTMLVideoElement, url: string, art: any) => void>; // 自定义播放逻辑
      subtitle?: { url: string }; // 字幕配置
    }>,
    required: true,
  },
});
// 定义向父组件发送事件
const emit = defineEmits(['get-instance']);
// 创建实例的引用
const artPlayerInstance = ref<any>(null);
// 在组件挂载时创建 Artplayer 实例
onMounted(() => {
  artPlayerInstance.value = new Artplayer({
    ...props.option,
    container: artRef.value!,
    plugins: [
    artplayerPluginLibass({
      workerUrl: 'https://unpkg.com/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.js',
      fallbackFont: '/public/SourceHanSansCN-Bold.woff2', // 字体路径
    }),
  ],
  });
  // 确保 Artplayer 实例创建后将其传递给父组件
  emit('get-instance', artPlayerInstance.value);
});
// 组件销毁时销毁 Artplayer 实例
onBeforeUnmount(() => {
  if (artPlayerInstance.value && artPlayerInstance.value.destroy) {
    artPlayerInstance.value.destroy(false);
  }
});

// 切换视频方法
const switchVideo = (newUrl: string) => {
  if (artPlayerInstance.value) {
    // 跳转到视频的指定时间点（例如从第 0 秒开始）
    artPlayerInstance.value.seek = 0;
    setTimeout(() => {
      // 使用 artPlayerInstance 切换视频 URL
      console.log(artPlayerInstance.value)
      artPlayerInstance.value.switchUrl(newUrl);
      console.log(`视频已切换到: ${newUrl}`);
    }, 0); // 延迟 10ms后切换视频
  }
};

// 切换视频方法
const switchSubtitle = (newUrl: string) => {
  if (artPlayerInstance.value) {
    // 跳转到视频的指定时间点（例如从第 0 秒开始）
    setTimeout(() => {
      // 使用 artPlayerInstance 切换视频 URL
      console.log(artPlayerInstance.value)
      artPlayerInstance.value.subtitle.url=newUrl;
      console.log(`字幕已切换到: ${newUrl}`);
    }, 0); // 延迟 10ms后切换视频
  }
};

const switchAssSubtitle = (newSubUrl:string) =>{
  if(artPlayerInstance.value){

  }
}

// 暴露 switchVideo 方法给父组件调用
defineExpose({
  switchVideo,
  switchSubtitle,
});

// 引用 Artplayer 容器
const artRef = ref<HTMLDivElement | null>(null);
</script>
