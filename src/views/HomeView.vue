<template>
  <div class="container">
    <!-- 导航栏 -->
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '/src/components/navbar-component.vue';
import Carousel from '/src/components/carousel-component.vue';
import VideoList from '/src/components/video-list-component.vue';
import RandomRecommendationPicturesCom from '@/components/RandomRecommendationPicturesCom.vue';
import Login from '/src/views/Login.vue'
import '../assets/home.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default defineComponent({
  name: 'HomePage',
  components: {
    Navbar,
    Carousel,
    VideoList
  }
});
</script>
