// 引入路由
import router from '@/routers'
// 引入进度条插件
import nprogress from 'nprogress'
// 引入nprogress样式
import 'nprogress/nprogress.css'
// 全局路由守卫:项目中任意路由切换时触发此钩子
// 全局前置路由守卫
router.beforeEach((_to, _from, _next) => {
  nprogress.start()
  _next()
})

// 全局后置路由守卫
router.afterEach((_to, _from) => {
  nprogress.done()
})
