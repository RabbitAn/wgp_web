import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserList from '@/views/users/UserList.vue'
import UserDetail from '@/views/users/UserDetail.vue'
import RoleList from '@/views/roles/RoleList.vue'
import RoleDetail from '@/views/roles/RoleDetail.vue'
import Login from '@/views/Login.vue'
import About from '@/views/about/About.vue'

// 进度条
import NProgress from '@/utils/progress'

// 用户状态
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { 
        anonymous: true // 允许匿名访问
      }
    },
    {
      path: '/',
      name: 'layout',
      component: BasicLayout,
      redirect: '/home', // 添加重定向到 home
      children: [
        {
          path: '/home',
          name: 'home',
          component: Dashboard,
          meta: {
            title: '首页',
            icon: 'home'
          }
        },
        {
          path: 'users',
          name: 'users',
          component: UserList,
          meta: {
            title: '用户管理',
            icon: 'user'
          }
        },
        {
          path: 'users/:id',
          name: 'userDetail',
          component: UserDetail,
          props: true,
          meta: {
            title: '用户详情',
            hidden: true // 在菜单中隐藏
          }
        },
        {
          path: 'roles',
          name: 'roles',
          component: RoleList,
          meta: {
            title: '角色管理',
            icon: 'role'
          }
        },
        {
          path: 'roles/:id',
          name: 'roleDetail',
          component: RoleDetail,
          props: true,
          meta: {
            title: '角色详情',
            hidden: true // 在菜单中隐藏
          }
        },
            {
          path: 'about',
          name: 'about',
          component: About,
          props: true,
          meta: {
            title: '关于',
            icon: 'about'
          }
        }
      ]
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 开始进度条
  NProgress.start()
  
  // 获取用户状态
  const userStore = useUserStore()
  
  // 检查是否需要认证
  const requiresAuth = !to.meta?.anonymous
  
  if (requiresAuth && !userStore.isLoggedIn && userStore.isTokenExpired) {
    // 需要认证但未登录，重定向到登录页
    // 立即完成进度条并跳转
    NProgress.done()
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'login' && userStore.isLoggedIn) {
    // 已登录用户访问登录页，重定向到首页
    // 立即完成进度条并跳转
    NProgress.done()
    next({ name: 'home' })
  } else {
    // 其他情况允许访问
    next()
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

export default router