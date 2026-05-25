import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import PlaceOrderView from '@/views/PlaceOrderView.vue'
import OrdersView from '@/views/OrdersView.vue'
import MyAccountView from '@/views/MyAccountView.vue'

import MainLayout from '@/layouts/MainLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import AdminOrdersView from '@/views/admin/AdminOrdersView.vue'
import AdminTradesView from '@/views/admin/AdminTradesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: EmptyLayout,
      children: [
        { path: '', component: LoginView },
      ],
    },
    {
      path: '/register',
      component: EmptyLayout,
      children: [{ path: '', component: RegisterView }],
    },

    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', redirect: '/orders' },
        { path: 'me', component: MyAccountView },
        { path: 'orders', component: OrdersView },
        { path: 'place-order', component: PlaceOrderView },
      ],
    },

    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', component: AdminDashboardView },
        { path: 'users', component: AdminUsersView },
        { path: 'users/:id', component: AdminUsersView },
        { path: 'orders', component: AdminOrdersView },
        { path: 'trades', component: AdminTradesView },
      ],
    },
  ],
})

// 全局登录态守卫（未登录时跳转到登录页，已登录时禁止访问登录页和注册页）：
router.beforeEach(async (to) => {
  const { token, user, fetchMe, clearAuthState } = useAuth()
  const publicPaths = ['/login', '/register']

  const isPublic = publicPaths.includes(to.path)
  // 未登录 + 访问的是需要登录的页面:
  if (!token.value && !isPublic) {
    return '/login'
  }
  // 未登录 + 访问的是登录或注册页:
  if (!token.value && isPublic) {
    return true
  }
  // 已登录但用户信息未加载:
  if (token.value && !user.value) {
    try {
      await fetchMe()
    } catch {
      clearAuthState()
      return '/login'
    }
  }

  // 已登录 + 访问登录或注册页:
  const role = user.value?.role
  if (token.value && isPublic) {
    return role === 'admin' ? '/admin/dashboard' : role === 'sales' ? '/me' : '/orders'
  }

  // 普通用户不能进入 admin 页面：
  if (to.path.startsWith('/admin') && role !== 'admin') {
    return '/orders'
  }
  // admin 不能进入普通用户页面：
  if (role === 'admin' && !to.path.startsWith('/admin')) {
    return '/admin/dashboard'
  }
  // sales 不进入普通订单页：
  if (role === 'sales' && to.path === '/orders') {
    return '/me'
  }
  // admin 和 sales 不能进入正式下单页：
  if (to.path === '/place-order' && (role === 'admin' || role === 'sales')) {
    return role === 'sales' ? '/me' : '/admin/dashboard'
  }

  return true
})

export default router
