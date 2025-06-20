import type { agendaItem, agendaResponse, reqData } from '@/api/meeting/type'
import { reqAgenda, reqCancelAgenda, reqSubAgenda } from '@/api/meeting/index'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

const useMeetingStore = defineStore('meetingStore', () => {
  const reqData: reqData = reactive({
    type: '',
    date: '',
    num: -1, // num==-1代表全部日期
  })

  const agendaItems = ref<agendaItem[]>([])

  const meetingNum = ref<number>(0)

  // 获取会议信息
  const getAgenda = async () => {
    const result: agendaResponse = await reqAgenda(reqData)
    if (result.code === 0) {
      agendaItems.value = result.data
      return 'ok'
    }
    else {
      return Promise.reject(new Error(result.msg))
    }
  }

  // 订阅会议
  const subAgenda = async (data: number) => {
    const id = {
      activityId: data,
    }
    await reqSubAgenda(id).then((res) => {
      if (res.code === 0) {
        return 'ok'
      }
      else {
        return Promise.reject(new Error(res.msg))
      }
    })
  }
  // 取消订阅
  const cancelAgenda = async (id: number) => {
    await reqCancelAgenda(id).then((res) => {
      if (res.code === 0) {
        return 'ok'
      }
      else {
        return Promise.reject(new Error(res.msg))
      }
    })
  }

  return {
    reqData,
    agendaItems,
    meetingNum,
    getAgenda,
    subAgenda,
    cancelAgenda,
  }
})
export default useMeetingStore
