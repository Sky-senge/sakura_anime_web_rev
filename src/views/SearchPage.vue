<template>
  <SearchVideoList :animeList="animeList"/>
  <!-- 分页器 -->
  <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentPageChange"/>
</template>

<script setup lang="ts">
import SearchVideoList from '@/components/SearchVideoList.vue';
import { request } from '@/utils/request';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const animeList = ref<Anime[]>([]);
interface Anime {
    id: number;
    name: string;
    tags: string[];
    description: string;
    rating: number;
    releaseDate: string;
    filePath: { episodes: number; fileName: string }[];
  }

const size = ref(30);
const total = ref(0);
const currentPage = ref(1);
const keyWords = ref(route.query.kw as string || ''); // 如果没有 `kw`，默认值为空字符串


const fetchAnimeList = async() =>{
  const countURL = getCountURL();
  const queryURL = getQueryURL();
  const countResponse = await request.get(countURL);
  if(countResponse.data.status){
    total.value = countResponse.data.data;
  }
  const response = await request.get(queryURL)
  if(response.data.status){
    animeList.value = response.data.data;
  }
}

const getCountURL = () =>{
  if(route.query.kw!==''){
    return `/anime/countSearchByName?keyWord=${keyWords.value}&size=${size.value}`
  }else{
    return `/anime/countAnimePage?size=${size.value}`
  }
}

const getQueryURL = () =>{
  if(route.query.kw!==''){
    return `/anime/searchByName?keyWord=${keyWords.value}&page=${currentPage.value}&size=${size.value}`
  }else{
    return `/anime/getAnimeList?page=${currentPage.value}&size=${size.value}`
  }
}

// 分页处理
const handleCurrentPageChange = (page: number) => {
  currentPage.value = page;
  fetchAnimeList();
};

onMounted(()=>{
  fetchAnimeList();
})

</script>