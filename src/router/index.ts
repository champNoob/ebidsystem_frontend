import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import PlaceOrderView from '@/views/PlaceOrderView.vue'
import OrdersView from '@/views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/place-order', component: PlaceOrderView },
    { path: '/orders', component: OrdersView },
    { path: '/', redirect: '/login' },
  ],
})

export default router
