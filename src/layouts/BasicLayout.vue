<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu, NIcon, NSpace, NAvatar, NDropdown } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h, computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { HomeOutline, PeopleOutline,AlertCircleOutline } from '@vicons/ionicons5'
import{ UserOutlined,UsergroupAddOutlined} from "@vicons/antd"

// 从环境变量获取应用配置
const appName = import.meta.env.VITE_APP_NAME || '后台管理系统'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 控制侧边栏折叠状态
const collapsed = ref(false)

// 当前选中的菜单项
const activeKey = ref<string | null>(null)

// 监听路由变化，更新选中的菜单项
watch(
  () => route.name,
  (newRouteName) => {
    activeKey.value = newRouteName as string || null
  },
  { immediate: true }
)

// 图标映射
const iconComponents: Record<string, any> = {
  home: HomeOutline,
  user: UsergroupAddOutlined,
  role:UserOutlined,
  about: AlertCircleOutline
}

// 从路由配置生成菜单项
const menuOptions = computed<MenuOption[]>(() => {
  // 查找根路由（path 为 '/' 的路由）
  const homeRoute = router.options.routes.find(r => r.path === '/')

  if (!homeRoute || !homeRoute.children) return []
  
  return homeRoute.children
    .filter(child => 
      child.name && 
      !child.meta?.hidden && 
      // 过滤掉包含动态参数的路由
      !child.path?.includes(':')
    ) // 过滤掉没有名称或标记为隐藏的路由
    .map(child => {
      // 从路由meta中获取图标名称
      const iconKey = child.meta?.icon as string || null
      // 根据图标名称获取对应的图标组件
      const iconComponent = iconKey ? iconComponents[iconKey] : null
      return {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: child.name as string
              }
            },
            { default: () => child.meta?.title || (child.name as string) }
          ),
        key: child.name as string,
        icon: iconComponent ? renderIcon(iconComponent) : undefined
      }
    })
})

// 图标渲染函数
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 下拉菜单选项
const dropdownOptions = computed(() => [
  {
    label: '个人中心',
    key: 'profile'
  },
  {
    label: '设置',
    key: 'settings'
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
])

// 处理下拉菜单选择
const handleDropdownSelect = (key: string | number) => {
  // 确保 key 是字符串类型
  const keyStr = String(key);
  
  switch (keyStr) {
    case 'logout':
      // 清除用户信息
      userStore.clearUserInfo()
      // 跳转到登录页
      router.push({ name: 'Login' }) // 修正路由名称为'Login'
      break
    case 'profile':
      // 跳转到个人中心（此处可替换为实际路由）
      console.log('跳转到个人中心')
      break
    case 'settings':
      // 跳转到设置页面（此处可替换为实际路由）
      console.log('跳转到设置页面')
      break
  }
}
</script>

<template>
  <n-layout has-sider class="h-screen">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
      class="h-full"
    >
      <div class="logo-section flex items-center justify-center h-16 border-b border-gray-200">
        <div v-if="!collapsed" class="text-lg font-bold flex items-center justify-center ">
          <img  src="/wgp.svg" class="w-20 h-8  mt2"></img>
          {{ appName }}
        </div>
        <img v-else src="/wgp.svg"  class="w-20 h-8"></img>
      </div>
      <n-menu
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered class="h-16 px-4">
        <div class="flex items-center h-full">
          <!-- 左侧 面包屑导航 -->
          <div class="flex items-center">
            <Breadcrumb />
          </div>
          
          <!-- 右侧 用户信息 -->
          <div class="flex items-center ml-auto">
            <n-dropdown 
              :options="dropdownOptions" 
              @select="handleDropdownSelect" 
              trigger="hover"
              placement="bottom-end"
            >
              <n-space align="center" class="cursor-pointer">
                <n-avatar round :size="32">
                  {{ userStore.userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </n-avatar>
                <span>{{ userStore.userInfo?.name || '未知用户' }}</span>
              </n-space>
            </n-dropdown>
          </div>
        </div>
      </n-layout-header>
      <n-layout-content class="p-4">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.h-screen {
  height: 100vh;
}

.h-full {
  height: 100%;
}

.h-16 {
  height: 4rem;
}

.cursor-pointer {
  cursor: pointer;
}

.logo-section {
  background-color: #f5f5f5;
}
</style>