<template>
    <el-container>
      <el-header>
        <el-button type="primary" @click="refreshImages">随机刷新图片</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(image, index) in images" :key="index">
            <el-card>
              <img :src="image" class="image" />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        images: this.getRandomImages()
      };
    },
    methods: {
      getRandomImages() {
        // 模拟获取随机图片的函数
        const imageUrls = [
          'https://via.placeholder.com/300x200.png?text=Image+1',
          'https://via.placeholder.com/300x200.png?text=Image+2',
          'https://via.placeholder.com/300x200.png?text=Image+3',
          'https://via.placeholder.com/300x200.png?text=Image+4',
          'https://via.placeholder.com/300x200.png?text=Image+5',
          'https://via.placeholder.com/300x200.png?text=Image+6',
          'https://via.placeholder.com/300x200.png?text=Image+7',
          'https://via.placeholder.com/300x200.png?text=Image+8'
        ];
        // 随机打乱数组
        return imageUrls.sort(() => Math.random() - 0.5);
      },
      refreshImages() {
        this.images = this.getRandomImages();
      }
    }
  }
  </script>
  
  <style>
  .image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  </style>