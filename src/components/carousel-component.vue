<template>
  <section class="carousel">
    <a-carousel
      :style="{ width: '100%', height: '300px' }"
      :default-current="1"
      indicator-type="line"
      :auto-play="true"
      @change="handleChange"
    >
      <a-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" alt="轮播图" :style="{ width: '100%', height: '100%', objectFit: 'cover' }" />
      </a-carousel-item>
    </a-carousel>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject } from 'vue';
import '@arco-design/web-vue/dist/arco.css';
import { fileRequest } from '@/utils/request';

// 使用 inject 获取从App.vue提供的 serverUrl，并声明类型
const serverUrl = inject<string>('serverUrl');

export default defineComponent({
  name: 'Carousel',
  setup() {
    // 定义轮播图数据
    const images = ref<string[]>([]);

    interface CarouselResponse {
      status: boolean;
      data: string[];
      message: string;
      error: string | null;
    }

    // 获取轮播图数据
    const fetchCarouselList = async () => {
      try {
        const response = await fileRequest.get<CarouselResponse>('/getCarouselList');
        if (response.data.status) {
          images.value = response.data.data.map(
            (fileName) => `${serverUrl}/files/getCarouse/${fileName}`
          );
          console.log('轮播图加载成功:', images.value);
        } else {
          console.error('获取轮播图失败:', response.data.message);
        }
      } catch (error) {
        console.error('请求轮播图时发生错误:', error);
    }
};

    // 轮播图切换事件处理
    const handleChange = (value: number) => {
      console.log('当前轮播页:', value);
    };

    // 加载时获取数据
    onMounted(fetchCarouselList);

    return {
      images,
      handleChange
    };
  }
});
</script>

<style scoped>
.carousel {
  max-height: 300px;
  margin: 0 auto; /* 水平居中，与 .video-list 保持一致 */
  max-width: 1150px; /* 限制最大宽度，与 .video-list 一致 */
  padding: 0; /* 内边距保持不变 */
  transition: all .3s;
}

.carousel img {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .carousel {
    max-height: 0px;
  }
}
</style>
