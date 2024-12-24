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

<script setup>
import { onMounted, ref } from 'vue';
import { fileRequest } from '@/utils/request';
import { useGlobalStore } from '@/stores/globalSettings';

const globalSettings = useGlobalStore();
const serverUrl = globalSettings.serverUrl;

const imageUrls = ref([
    // 'https://via.placeholder.com/300x200.png?text=Image+1',
    // 'https://via.placeholder.com/300x200.png?text=Image+2',
    // 'https://via.placeholder.com/300x200.png?text=Image+3',
    // 'https://via.placeholder.com/300x200.png?text=Image+4',
    // 'https://via.placeholder.com/300x200.png?text=Image+5',
    // 'https://via.placeholder.com/300x200.png?text=Image+6',
    // 'https://via.placeholder.com/300x200.png?text=Image+7',
    // 'https://via.placeholder.com/300x200.png?text=Image+8'
  ]);


// 模拟获取随机图片的函数
const getRandomImages = () => {
  return imageUrls.value.sort(() => Math.random() - 0.5);
};

const images = ref(getRandomImages());

const refreshImages = () => {
  images.value = getRandomImages();
};

const fetchImageList = async() => {
  try{
    const response = await fileRequest.get("/getPicLibImagesList")
    if(response.data.status){
      imageUrls.value = response.data.data.map(
        (fileName) => `${serverUrl}/files/getPicLibImage/${fileName}`
      ); //写入图像列表
      refreshImages();
    }else{
      console.error("图库API请求失败！")
    }
  }catch(e){
    console.error(`获取图库资源错误！${e}`)
  }
}

onMounted(()=>{
fetchImageList()
})
</script>

<style>
.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
