<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem, NIcon } from 'naive-ui'
import { h, computed } from 'vue'
import { HomeOutline,AlertCircleOutline } from '@vicons/ionicons5'
import{ UserOutlined,UsergroupAddOutlined} from "@vicons/antd"

interface BreadcrumbItem {
  title: string
  path: string
  icon?: any
}

const route = useRoute()
const router = useRouter()

// 创建路由标题映射，避免每次都调用 router.getRoutes()
const routeTitleMap = new Map([
  ['/', '首页'],
  ['/home', '首页'],
  ['/users', '用户管理'],
  ['/theme-test', '主题测试']
])

// 计算面包屑
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(item => item)

  //从路由中获取title和图标
  const routeRes = router.getRoutes().find(route => route.path === '/' + pathArray[0])
  

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: '首页',
      path: '/',
      icon: HomeOutline
    }
  ]
  
  pathArray.forEach((item, index) => {
    const path = '/' + pathArray.slice(0, index + 1).join('/')
    let title = ''
    
    // 根据路径设置标题
    switch (item) {
      case 'users':
        title = '用户管理'
        break
      case 'home':
        title = '首页'
        break
      case 'theme-test':
        title = '主题测试'
        break
      default:
        // 从预定义映射中获取标题，避免调用 router.getRoutes()
        title = routeTitleMap.get(path) || item
    }
    
    breadcrumbs.push({
      title: routeRes?.meta.title as string || title,
      path,
      icon: routeRes?.meta.icon
    })
  })
  
  return breadcrumbs
})

const iconComponents: Record<string, any> = {
  home: HomeOutline,
  user: UsergroupAddOutlined,
  role:UserOutlined,
  about: AlertCircleOutline
}


</script>

<template>
  <n-breadcrumb>  
    <n-breadcrumb-item 
      v-for="(item, index) in breadcrumbs" 
      :key="item.path"
    >
      <router-link :to="item.path" class="breadcrumb-link">
        <n-icon v-if="item.icon" :component="iconComponents[item.icon] || null" class="breadcrumb-icon" />
        {{ item.title }}
      </router-link>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<style scoped>
.breadcrumb-icon {
  margin-right: 4px;
  vertical-align: middle;
}

.breadcrumb-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}
</style>