<template>
    <section class="carousel">
      <a-carousel :style="{ width: '100%', height: '300px' }" :default-current="1" @change="handleChange">
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
      const images = ref([
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp'
      ]);
  
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
    margin-bottom: 20px;
  }
  </style>