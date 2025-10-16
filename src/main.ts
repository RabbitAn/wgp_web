import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

import App from './App.vue'
import router from './router'

// 引入 UnoCSS
import 'uno.css'

// 引入全局样式
import '@/styles/naive-ui.css'
import '@/styles/theme.css'
import '@/styles/transition.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化用户状态
const userStore = useUserStore()
userStore.initUser()

app.mount('#app')

// 添加一个空的导出以避免 TypeScript 警告
export {}