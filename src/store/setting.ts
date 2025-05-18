// 引入常量路由
import { constantRoutesPC } from '@/routers/route'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useLayoutSettingStore = defineStore('settingStore', () => {
  const menuList = ref(constantRoutesPC[0].children)
  // 是否显示对话框
  const dialogFormVisible = ref(false)
  // 是否显示注册对话框
  const dialogRegisterVisible = ref(false)
  // 是否登录
  const isLog = ref(false)
  const isLoading = ref(true)
  return {
    menuList,
    dialogFormVisible,
    dialogRegisterVisible,
    isLoading,
    isLog,
  }
})

export default useLayoutSettingStore
