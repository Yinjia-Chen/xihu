<script setup lang="ts">
// 引入子组件
import Footer from './footer/index.vue'
import Main from './main/index.vue'
import Sidebar from './sidebar/index.vue'
import Tabbar from './tabbar/index.vue'
</script>

<template>
  <div class="layout">
    <!-- 顶栏 -->
    <Tabbar class="tabbar" />

    <!-- 主体 -->
    <Main class="main" />

    <!-- 侧栏 -->
    <Sidebar class="sidebar" />

    <!-- 底栏 -->
    <Footer class="footer" />
  </div>
</template>

<style scoped lang="scss">
.layout {
  background-color: #fafafa;
  position: relative;
  overflow: hidden;

  .tabbar {
    position: fixed;
    z-index: 999;
    width: 100%;
  }
  .footer {
    position: absolute;
    bottom: 0;
    z-index: 999;
  }

  .main {
    padding-top: 1rem;
    margin-bottom: 8rem;
  }

  .sidebar {
    position: fixed;
    z-index: 9999;
    bottom: 1.25rem;
    right: 0.375rem;
  }
}
</style>
