<template>
  <div class="container">
    <Navbar />
    <Carousel />
    <!-- <section class="weekly-update">
      <VideoList />
    </section> -->
    <section class="latest-section">
      <VideoList />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '/src/components/navbar-component.vue';
import Carousel from '/src/components/carousel-component.vue';
import VideoList from '/src/components/video-list-component.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    Navbar,
    Carousel,
    VideoList
  }
});
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #121212;
  color: white;
}

.weekly-update,
.latest-section {
  margin-bottom: 20px;
  text-align: center;
}
</style>