import ElementPlus from 'element-plus'
// @ts - expect - error 忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
// 引入全局自定义插件
import gloablComponent from './components/index.ts'
// 引入路由
import router from './routers'
// 引入 rem 相对尺寸配置
import './utils/flexible'
// 引入element-plus
import 'element-plus/dist/index.css'

// 引入 Svg
import 'virtual:svg-icons-register'
// 引入全局样式
import '@/styles/index.scss'

const app = createApp(App)

app.use(createPinia())

app.use(router)

// 项目集成全局ElementPlus
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(gloablComponent)

app.mount('#app')
