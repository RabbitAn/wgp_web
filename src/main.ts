import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { 
  NConfigProvider, 
  NCard, 
  NDataTable, 
  NButton, 
  NTag,
  NPopconfirm,
  NInput,
  NForm,
  NFormItem,
  NSpace,
  NModal,
  NSelect,
  NPagination,
  NSwitch,
  NCheckbox,
  NCheckboxGroup
} from 'naive-ui'

import App from './App.vue'
import router from './router'

// 引入 UnoCSS 样式
import 'virtual:uno.css'

// 引入 naive-ui 样式
import './styles/naive-ui.css'

// 引入主题样式
import './styles/theme.css'

// 引入过渡动画样式
import './styles/transition.css'

// 从环境变量获取应用配置
const appName = import.meta.env.VITE_APP_NAME || '后台管理系统'
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'

console.log(`应用名称: ${appName}, 版本: ${appVersion}`)

const app = createApp(App)

// 先创建并使用 Pinia
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 初始化主题（在 Pinia 创建之后）
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化用户信息（在 Pinia 创建之后）
import { useUserStore } from './stores/user'
const userStore = useUserStore()
userStore.initUser()

// 添加 Naive UI 组件
app.component('NConfigProvider', NConfigProvider)
app.component('NCard', NCard)
app.component('NDataTable', NDataTable)
app.component('NButton', NButton)
app.component('NTag', NTag)
app.component('NPopconfirm', NPopconfirm)
app.component('NInput', NInput)
app.component('NForm', NForm)
app.component('NFormItem', NFormItem)
app.component('NSpace', NSpace)
app.component('NModal', NModal)
app.component('NSelect', NSelect)
app.component('NPagination', NPagination)
app.component('NSwitch', NSwitch)
app.component('NCheckbox', NCheckbox)
app.component('NCheckboxGroup', NCheckboxGroup)

app.mount('#app')

// 添加一个空的导出以避免 TypeScript 警告
export {}