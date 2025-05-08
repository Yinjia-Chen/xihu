// 通过 vue-router 插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'

// 引入常量路由
import { constantRoutesPC } from './route'

// 创建路由器
const router = createRouter({
  history: createWebHashHistory(), // 路由模式:哈希
  routes: constantRoutesPC,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
