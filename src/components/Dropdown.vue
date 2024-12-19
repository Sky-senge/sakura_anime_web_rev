<template>
  <div class="dropdown-wrapper">
    <transition name="fade">
      <div v-if="isDropdownVisible" class="dropdown-menu" @mousedown="onDropdownMouseDown">
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
  background: #e2e4e9;
  z-index: 0721;
  border-radius: 8px;
  transform: translateY(5px);
  overflow: hidden;
  transition: opacity .3s ease , transform .5s;
}

.fade-enter-active,
.fade-leave-active {
  transform: translateY(5px);
  transition: opacity .3s ease , transform .5s;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(-18px);
  opacity: 0;
}
</style>
