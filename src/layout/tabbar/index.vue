<script setup lang="ts">
// 引入 title & logo 配置
import setting from '@/setting'
// 引入 LayoutSetting 仓库
import useLayoutSettingStore from '@/stores/setting'

// 引入 Menu 子组件
import Menu from './Menu.vue'

// 使用 LayoutSetting 仓库
const layoutSettingStore = useLayoutSettingStore()
</script>

<!-- 对外暴露组件 -->
<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<template>
  <div class="underframe">
    <!-- logo -->
    <img :src="setting.logo(1)" class="logo" />
    <el-menu
      default-active="1"
      mode="horizontal"
      background-color="transparent"
      :ellipsis="false"
      active-text-color="#409EFF"
      router
      style="font-size: 0.2857rem !important"
    >
      <!-- 菜单组件 -->
      <Menu :menu-list="layoutSettingStore.menuList" />

      <!-- 直播 -->
      <el-menu-item index="8" style="color: #ff0020; font-size: 0.2571rem">
        直播
        <el-icon
          style="
            width: 0.1429rem;
            height: 0.1286rem;
            color: #ff0000;
            transform: translateY(-0.0714rem);
          "
        >
          <Histogram />
        </el-icon>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.underframe {
  height: 1rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(0.0714rem);
  font-size: 0.2857rem;

  .el-menu {
    margin-left: 1.4286rem;
    width: 50%;
    font-weight: 400;
    border-bottom: none;
    display: flex;
    align-items: center;
    height: 85%;
  }

  .logo {
    width: 3.1143rem;
    height: 0.6714rem;
    margin: 0 0.4286rem 0 1.7143rem;
  }
}
</style>
