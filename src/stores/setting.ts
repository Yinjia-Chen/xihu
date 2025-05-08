// 引入常量路由
import { constantRoutesPC } from '@/routers/route'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useLayoutSettingStore = defineStore('settingStore', () => {
  const menuList = ref(constantRoutesPC[0].children)
  return {
    menuList,
  }
})

export default useLayoutSettingStore
