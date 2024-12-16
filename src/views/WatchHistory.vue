<template>
    <div class="watch-history-container" style="height: 92vh;">
        <!-- 标题部分 -->
        <div class="hl-rb-head hl-hidden-xs clearfix">
            <h2 class="hl-rb-title">观看记录</h2>
        </div>

        <el-table :data="watchHistoryList" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户名" prop="displayName"></el-table-column>
            <el-table-column label="动漫" prop="animeName"></el-table-column>
            <el-table-column label="集数" prop="episodes"></el-table-column>
        </el-table>

        <el-pagination @current-change="handleCurrentPageChange" :current-page="currentPage"
            layout="prev, pager, next" :total="total" />
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import request from '@/utils/request';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
userStore.loadUser();

const watchHistoryList = ref<WatchHistory[]>([]);
// 定义接口
interface WatchHistory {
  id: number; // 唯一标识
  userId: number; // 用户ID
  displayName: string; // 用户名
  animeId: number; // 动漫ID
  animeName: string; // 动漫名
  episodes: number; // 观看集数
  createAt: string; // 创建时间ISO8601格式
}

const currentPage = ref(1);
const total = ref(0);
//一页查询的数量
const size = ref(50);

const fetchHistoryRecordCount = async() =>{
    const countResponse = await request.get(`/user/countHistory?size=${size.value}`)
    if(countResponse.data.status){
        total.value = countResponse.data.data * 10;
    }
}

const fetchHistoryRecord = async() =>{
    const response = await request.get(`/user/getHistory?page=${currentPage.value}&size=${size.value}`)
    if(response.data.status){
        watchHistoryList.value = response.data.data;
    }
}

const handleCurrentPageChange = async (page: number) => {
  currentPage.value = page;
  await fetchHistoryRecord();
};

onMounted(() => {
    fetchHistoryRecordCount();
    fetchHistoryRecord();
})
</script>

<style scoped>
.watch-history-container {
    padding: 20px;
    /* 添加以下样式使其水平居中 */
    margin: 0 auto;
    /* 根据实际情况设置最大宽度，避免在大屏幕上过于拉伸 */
    width: 75%;
}

.hl-rb-head {
    margin-bottom: 10px;
}

.hl-tool-btns {
    margin-bottom: 10px;
}
</style>