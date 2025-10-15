import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 用户信息接口定义
export interface UserInfo {
  name: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  // 用户信息状态
  const userInfo = ref<UserInfo | null>(null)
  
  // 是否已登录
  const isLoggedIn = computed(() => !!userInfo.value)
  
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
  }
  
  // 获取用户权限
  const userRole = computed(() => userInfo.value?.role || '')

  return { 
    userInfo, 
    isLoggedIn, 
    userRole,
    setUserInfo, 
    clearUserInfo,
    initUser
  }
})