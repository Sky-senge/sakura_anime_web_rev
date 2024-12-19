<template>
  <div class="dropdown-wrapper">
    <transition name="fade">
      <div
        v-if="isDropdownVisible"
        class="dropdown-menu"
        @mousedown="onDropdownMouseDown"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  isDropdownVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:isDropdownVisible']);

const onDropdownMouseDown = () => {
  // 防止失焦关闭菜单
  emit('update:isDropdownVisible', true);
};
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
