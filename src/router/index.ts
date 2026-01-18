import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import PlaceOrderView from '@/views/PlaceOrderView.vue'
import OrdersView from '@/views/OrdersView.vue'
import MyAccountView from '@/views/MyAccountView.vue'

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

export default router
