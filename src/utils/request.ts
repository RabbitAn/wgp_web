import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080', // API base URL
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

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

// 检查token是否过期
const isTokenExpired = (): boolean => {
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
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {      
    // 添加认证 token (除了登录接口)
    if (!config.url?.includes('/login')) {
      // 检查token是否过期
      if (isTokenExpired()) {
        // token过期，清除本地存储并抛出错误
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_info')
        return Promise.reject(new Error('Token已过期，请重新登录'))
      }
      
      const token = localStorage.getItem('access_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    
    // 可以根据后端约定的状态码进行处理
    const res = response
    
    // 如果需要，可以在这里统一处理业务状态码
    // 例如：
    // if (res.code !== 200) {
    //   // 业务错误处理
    //   console.error('业务错误:', res.message)
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } 
    
    return response // 返回完整响应对象，以便调用方可以访问 response.data 等属性
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    
    // 可以根据错误状态码进行处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除本地token并跳转到登录页
          console.error('未授权，请重新登录')
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_info')
          // 这里可以添加跳转到登录页的逻辑
          // window.location.href = '/login'
          break
        case 403:
          // 拒绝访问
          console.error('拒绝访问')
          break
        case 404:
          // 请求资源不存在
          console.error('请求资源不存在')
          break
        case 500:
          // 服务器内部错误
          console.error('服务器内部错误')
          break
        default:
          console.error(`连接错误${error.response.status}`)
      }
    } else {
      // 网络错误
      console.error('网络错误')
    }
    
    return Promise.reject(error)
  }
)

export default service