<template>
  <section class="carousel">
    <a-carousel :style="{ width: '100%', height: '300px' }" :default-current="1" indicator-type="line" @change="handleChange">
      <a-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" alt="轮播图" :style="{ width: '100%', height: '100%', objectFit: 'cover' }" />
      </a-carousel-item>
    </a-carousel>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import '@arco-design/web-vue/dist/arco.css';

export default defineComponent({
  name: 'Carousel',
  setup() {
    // 定义轮播图数据
    const images = ref([
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp'
    ]);

    // 轮播图切换事件处理
    const handleChange = (value: number) => {
      console.log('当前轮播页:', value);
    };

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