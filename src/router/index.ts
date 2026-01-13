import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
// import OrdersView from '@/views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    // { path: '/orders', component: OrdersView }, // 后续实现
    { path: '/', redirect: '/login' },
  ],
})

export default router
