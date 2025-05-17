// 引入常量路由
import { constantRoutesPC } from '@/routers/route'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useLayoutSettingStore = defineStore('settingStore', () => {
  const menuList = ref(constantRoutesPC[0].children)
  // 是否显示对话框
  const dialogFormVisible = ref(false)
  return {
    menuList,
    dialogFormVisible,
  }
})

export default useLayoutSettingStore
