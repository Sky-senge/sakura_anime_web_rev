<template>
  <div class="danmu-panel">
    <!-- 弹幕列表 -->
    <el-table :data="danmuList" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="user" label="用户"></el-table-column>
      <!-- 其他需要的列 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'DanmuPanel',
  data() {
    return {
      danmuList: [], // 弹幕列表数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      total: 0 // 总条数
    };
  },
  methods: {
    // 当每页显示条数改变时的处理函数
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchDanmuData();
    },
    // 当页码改变时的处理函数
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchDanmuData();
    },
    // 获取弹幕数据
    fetchDanmuData() {
      // 这里应该是调用后端API获取弹幕数据的逻辑
      // 假设后端API支持分页参数：page（当前页码）和limit（每页条数）
      // 你需要根据实际后端API调整这里的代码
      const params = {
        page: this.currentPage,
        limit: this.pageSize
      };
      // 模拟API调用
      this.getDanmuListFromApi(params).then(response => {
        this.danmuList = response.data.items; // 假设返回的数据中有items字段包含实际数据
        this.total = response.data.total; // 假设返回的数据中有total字段包含总条数
      });
    },
    // 删除弹幕
    handleDelete(danmu) {
      // 这里应该是调用后端API删除弹幕的逻辑
      // 弹出确认框
      this.$confirm('此操作将永久删除该弹幕, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API调用
        this.deleteDanmuFromApi(danmu.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 删除后重新获取数据
          this.fetchDanmuData();
        });
      }).catch(() => {
        // 取消删除
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 模拟从API获取弹幕列表的函数
    getDanmuListFromApi(params) {
      // 这里应该是实际调用后端API的代码
      // 以下为模拟数据
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              items: [
                // 模拟的弹幕数据
                { id: 1, content: '弹幕1', user: '用户A' },
                { id: 2, content: '弹幕2', user: '用户B' }
              ],
              total: 50
            }
          });
        }, 1000);
      });
    },
    // 模拟删除弹幕的API调用函数
    deleteDanmuFromApi(id) {
      // 这里应该是实际调用后端API删除弹幕的代码
      // 以下为模拟删除成功的响应
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
  },
  mounted() {
    // 组件挂载后立即获取弹幕数据
    this.fetchDanmuData();
  }
};
</script>

<style scoped>
.danmu-panel {
  /* 你的样式代码 */
}
</style>