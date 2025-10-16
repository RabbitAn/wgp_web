import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

// 用户信息接口定义
export interface UserInfo {
  name: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  
  // 用户信息状态
  const userInfo = ref<UserInfo | null>(null)
  
  // 是否已登录
  const isLoggedIn = computed(() => !!userInfo.value)

  const tokenRef=import.meta.env.VITE_TOKEN_REFRESH_TIME || 60

  // 解析 JWT token 获取过期时间
  const getTokenExpiration = (token: string): number | null => {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) {
        return null
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const payload = JSON.parse(jsonPayload)      
      return payload.exp ? payload.exp * 1000 : null // JWT 的 exp 是秒，转换为毫秒
    } catch (e) {
      console.error('解析 token 失败:', e)
      return null
    }
  }

  //token是否过期
  const isTokenExpired = computed(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return true
    }
    
    const expirationTime = getTokenExpiration(token)
    if (!expirationTime) {
      return true
    }
    
    const now = new Date().getTime()
    return now > expirationTime // 如果当前时间大于过期时间，则返回true
  })
  
  // 检查token是否过期并跳转
  const checkTokenAndRedirect = () => {
    if (isTokenExpired.value) {
      clearUserInfo()
      // 跳转到登录页面
      router.push('/login')
      return true
    }
    return false
  }
  
  // 设置用户信息
  function setUserInfo(user: UserInfo) {
    userInfo.value = user
    // 持久化保存到 localStorage
    localStorage.setItem('user_info', JSON.stringify(user))
  }
  
  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = null
    // 从 localStorage 中清除
    localStorage.removeItem('user_info')
    // 同时清除 access_token
    localStorage.removeItem('access_token')
  }
  
  // 初始化用户信息（从 localStorage 恢复）
  function initUser() {
    const savedUserInfo = localStorage.getItem('user_info')
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (e) {
        console.error('解析用户信息失败:', e)
        clearUserInfo()
      }
    }
    
    // 检查是否有 access_token，但没有用户信息的情况
    const token = localStorage.getItem('access_token')
    if (token && !userInfo.value) {
      // 这里可以调用 API 获取用户信息
      // 为了简化，我们创建一个默认用户
      userInfo.value = {
        name: '默认用户',
        role: 'user'
      }
    }
    
    // 检查token是否过期
    checkTokenAndRedirect()
  }
  
  // 获取用户权限
  const userRole = computed(() => userInfo.value?.role || '')

  return { 
    userInfo, 
    isLoggedIn, 
    isTokenExpired,
    checkTokenAndRedirect,
    userRole,
    setUserInfo, 
    clearUserInfo,
    initUser
  }
})