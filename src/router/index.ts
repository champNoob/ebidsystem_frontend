import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import LoginView from '@/views/LoginView.vue'
import PlaceOrderView from '@/views/PlaceOrderView.vue'
import OrdersView from '@/views/OrdersView.vue'
import MyAccountView from '@/views/MyAccountView.vue'
import RegisterView from '@/views/RegisterView.vue'

import MainLayout from '@/layouts/MainLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

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
        { path: 'place-order', component: PlaceOrderView },
        { path: 'orders', component: OrdersView },
        { path: 'me', component: MyAccountView },
      ],
    },
  ],
})

// 全局登录态守卫（未登录时跳转到登录页，已登录时禁止访问登录页和注册页）：
router.beforeEach((to) => {
  const { token } = useAuth()
  const publicPaths = ['/login', '/register']
  // 未登录 + 访问的是需要登录的页面:
  if (!token.value && !publicPaths.includes(to.path)) {
    return '/login'
  }
  // 已登录 + 访问登录或注册页:
  if (token.value && publicPaths.includes(to.path)) {
    return '/orders'
  }
})

export default router
