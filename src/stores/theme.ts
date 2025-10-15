import { ref } from 'vue'
import { defineStore } from 'pinia'

// 简化主题存储，只支持浅色主题
export const useThemeStore = defineStore('theme', () => {
  // 主题模式：只支持light
  const themeMode = ref<'light' | 'dark'>('light')
  
  // 初始化主题（只使用浅色主题）
  const initTheme = () => {
    themeMode.value = 'light'
    applyTheme()
  }
  
  // 应用主题（只应用浅色主题）
  const applyTheme = () => {
    // 移除所有可能的dark类
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')
    
    // 确保本地存储中不保存深色主题
    localStorage.setItem('theme', 'light')
  }
  
  // 空实现的切换主题函数（保持接口一致）
  const toggleTheme = () => {
    // 不执行任何操作，因为只支持浅色主题
    console.log('深色主题已禁用')
  }
  
  // 设置主题（只允许设置为浅色）
  const setTheme = (mode: 'light' | 'dark') => {
    themeMode.value = 'light' // 强制设置为浅色
    applyTheme()
  }
  
  return { 
    themeMode, 
    initTheme, 
    toggleTheme, 
    setTheme 
  }
})