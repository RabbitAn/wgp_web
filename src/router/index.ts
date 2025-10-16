import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NProgress from '@/utils/progress'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/home', // 添加默认重定向
    children: [
      {
        path: '/home',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '首页',
          icon: 'home'
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/users/UserList.vue'),
        meta: {
          title: '用户管理',
          icon: 'user'
        }
      },
      {
        path: '/users/:id',
        name: 'UserDetail',
        component: () => import('@/views/users/UserDetail.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/roles/RoleList.vue'),
        meta: {
          title: '角色管理',
          icon: 'role'
        }
      },
      {
        path: '/roles/:id',
        name: 'RoleDetail',
        component: () => import('@/views/roles/RoleDetail.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/About.vue'),
        meta: {
          title: '关于',
          icon: 'about'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 开始进度条
  NProgress.start()
  
  // 获取用户存储
  const userStore = useUserStore()
  
  // 检查是否需要认证
  if (to.name !== 'Login') {
    // 检查token是否过期
    if (isTokenExpired()) {
      // 清除用户信息
      userStore.clearUserInfo()
      // 重定向到登录页
      next({ name: 'Login' })
    } else {
      // Token有效，继续导航
      next()
    }
  } else {
    // 访问登录页，直接通过
    next()
  }
})

// 全局后置守卫
router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

export default router