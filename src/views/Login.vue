<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NCard, NAlert, NCheckbox, NIcon } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { LogInOutline, PersonOutline, LockClosedOutline, EyeOutline, EyeOffOutline } from '@vicons/ionicons5'
import NProgress from '@/utils/progress'
import { login } from '@/api/user'
import type { UserInfo } from '@/stores/user'

// 从环境变量获取应用配置
const appName = import.meta.env.VITE_APP_NAME || '后台管理系统'
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const formValue = ref({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

// 状态管理
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// 记住我功能
const handleRememberMeChange = (checked: boolean) => {
  formValue.value.rememberMe = checked
  if (checked) {
    localStorage.setItem('rememberMe', 'true')
    localStorage.setItem('username', formValue.value.username)
  } else {
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('username')
  }
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 登录处理
const handleLogin = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  errorMessage.value = ''

  // 简单验证
  if (!formValue.value.username || !formValue.value.password) {
    errorMessage.value = '请输入用户名和密码'
    loading.value = false
    return
  }

  try {
    // 调用真实API登录
    const response = await login({
      username: formValue.value.username,
      password: formValue.value.password
    })
    
    // 保存token到localStorage
    localStorage.setItem('access_token', response.data.access_token)
    
    // 根据API响应创建UserInfo对象
    const userInfo: UserInfo = {
      name: response.data.username,
      role: response.data.role
    }
    
    // 设置用户信息
    userStore.setUserInfo(userInfo)

    // 处理记住我功能
    if (formValue.value.rememberMe) {
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('username', formValue.value.username)
    } else {
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('username')
    }

    // 完成进度条
    NProgress.done()
    
    // 跳转到首页
    router.push('/')
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.response?.data?.detail || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

// 页面加载时检查是否已登录
onMounted(() => {
  if (userStore.isLoggedIn) {
    // 立即完成进度条并跳转
    NProgress.done()
    router.push('/')
  }
  
  // 检查是否记住用户
  const rememberMe = localStorage.getItem('rememberMe')
  const savedUsername = localStorage.getItem('username')
  if (rememberMe === 'true' && savedUsername) {
    formValue.value.username = savedUsername
    formValue.value.rememberMe = true
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 overflow-hidden ">
    <div class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <n-icon :component="LogInOutline" size="24" class="text-white" />
            </div>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ appName }}</h1>
          <p class="text-gray-600">现代化后台管理系统</p>
        </div>
        
        <n-card class="rounded-xl shadow-md border-0" :bordered="false">
          <n-form 
            :model="formValue" 
            :rules="rules" 
            @submit="handleLogin"
          >
            <n-alert v-if="errorMessage" type="error" class="mb-4 rounded-lg">
              {{ errorMessage }}
            </n-alert>
            
            <div class="space-y-4">
              <n-form-item path="username" class="mb-0">
                <n-input 
                  v-model:value="formValue.username" 
                  placeholder="请输入用户名" 
                  autocomplete="username"
                  size="large"
                  class="rounded-lg border-gray-200"
                >
                  <template #prefix>
                    <n-icon :component="PersonOutline" class="text-gray-500" />
                  </template>
                </n-input>
              </n-form-item>
              
              <n-form-item path="password" class="mb-0">
                <n-input 
                  v-model:value="formValue.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  size="large"
                  class="rounded-lg border-gray-200"
                  @keyup.enter="handleLogin"
                >
                  <template #prefix>
                    <n-icon :component="LockClosedOutline" class="text-gray-500" />
                  </template>
                  <template #suffix>
                    <n-icon 
                      :component="showPassword ? EyeOffOutline : EyeOutline" 
                      class="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" 
                      @click="togglePasswordVisibility"
                    />
                  </template>
                </n-input>
              </n-form-item>
            </div>
            
            <div class="flex justify-between items-center my-6">
              <n-checkbox 
                v-model:checked="formValue.rememberMe" 
                @update:checked="handleRememberMeChange"
                class="text-sm text-gray-700"
              >
                记住我
              </n-checkbox>
              <a href="#" class="text-sm text-blue-500 hover:text-blue-700 transition-colors">忘记密码？</a>
            </div>
            
            <n-button 
              type="primary" 
              attr-type="submit" 
              :loading="loading"
              :disabled="loading"
              size="large"
              block
            >
              {{ loading ? '登录中...' : '登录' }}
            </n-button>
          </n-form>
        </n-card>
      </div>
    </div>
    
    <div class="text-center text-gray-600 pb-4">
      <p class="text-sm">版本 {{ appVersion }}</p>
      <p class="text-xs mt-1">© 2025 WGP工程部. 保留所有权利.</p>
    </div>
  </div>
</template>

<style scoped>
/* 仅保留必要的自定义样式 */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

html, body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>