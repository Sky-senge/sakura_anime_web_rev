<template>
  <div ref="artRef" class="artplayer-container"></div>
</template>

<script>
import Artplayer from "artplayer"; // 引入Artplayer

export default {
  data() {
    return {
      instance: null,
    };
  },
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.instance = new Artplayer({
      ...this.option,
      container: this.$refs.artRef,
    });

    this.$nextTick(() => {
      this.$emit("get-instance", this.instance); // 将实例传递给父组件
    });
  },
  beforeDestroy() {
    if (this.instance && this.instance.destroy) {
      this.instance.destroy(false);
    }
  },
  watch: {
    option: {
      handler(newOption) {
        if (this.instance) {
          this.instance.update(newOption); // 使用Artplayer的update方法更新配置
        }
      },
      deep: true,
    },
  },
};
</script>
