import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  easing: 'ease',
  speed: 100, // 减少动画速度
  showSpinner: false,
  trickleSpeed: 20, // 减少滴漏速度
  minimum: 0.1 // 减少最小百分比
})

export default NProgress