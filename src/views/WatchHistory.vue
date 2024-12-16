<template>
    <div class="watch-history-container" style="height: 92vh;">
        <!-- 标题部分 -->
        <div class="hl-rb-head hl-hidden-xs clearfix">
            <h2 class="hl-rb-title">观看记录</h2>
        </div>

        <el-table :data="watchHistoryList" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户名" prop="userId"></el-table-column>
            <el-table-column label="动漫" prop="animeId"></el-table-column>
            <el-table-column label="集数" prop="episodes"></el-table-column>
        </el-table>


        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            layout="prev, pager, next" :total="totalCount" />
    </div>
</template>

<script setup>

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