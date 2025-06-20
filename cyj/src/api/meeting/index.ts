import type { agendaResponse, reqData } from './type'
import request from '@/utils/request'

enum API {
  GET_AGENDA = '/activities/list',
  SUB_AGENDA = '/registration',
  GET_AGENDA_USER = '/goodactivities/Info',
}

interface id {
  activityId: number
}
export function reqAgenda(data: reqData) {
  return request.post<any, agendaResponse>(API.GET_AGENDA, data)
}

export function reqSubAgenda(data: id) {
  return request.post<any, any>(API.SUB_AGENDA, data)
}

export function reqCancelAgenda(id: number) {
  return request.delete<any, any>(`${API.SUB_AGENDA}/${id}`)
}

export function reqUserAgenda() {
  return request.get<any, agendaResponse>(API.GET_AGENDA_USER)
}
