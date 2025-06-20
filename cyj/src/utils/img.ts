// 统一处理图片路径，支持网络图片和本地图片的加载：
export function getImg(url: string) {
  // 如果是网络图片，直接返回
  if (url.includes('http')) {
    return url
  }
  // 如果是本地图片，使用 import.meta.url 处理路径(拼接相对路径)
  else {
    // 获取 import.meta.url 的上一级路径
    const parentPath = new URL('..', import.meta.url).href
    // console.log(import.meta.url)
    // console.log(new URL(`../assets/images/${url}`, import.meta.url).href)
    // let newURL = new URL(`../assets/images/${url}`, import.meta.url).href
    return `/src/assets/images/${url}`
    // return `/src/assets/images/${url}`
  }
}
