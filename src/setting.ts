// 项目 logo & title 配置
export default {
  title: '西湖论剑数字平台', // 项目标题
  logo1: '/public/logo/logo1.png', // 项目logo
  logo2: '/public/logo/logo2.png',
  logo3: '/public/logo/logo3.png',
  // 箭头函数实现不同页面轮换logo
  logo: (num: number) => {
    return `/public/logo/logo${num}.png`
  },
}
