<script setup lang="ts"></script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped>
.fade-enter-active {
  transition: all 1s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}
</style>
