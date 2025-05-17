// 封装 本地存储 存储数据 与 读取数据 方法

// 本地存储数据
export function SET_TOKEN(token: string) {
  localStorage.setItem('TOKEN', token)
}

// 本地获取数据
export function GET_TOKEN() {
  return localStorage.getItem('TOKEN')
}

// 本地删除数据
export function REMOVE_TOKEN() {
  localStorage.removeItem('TOKEN')
}
