
import api from '@/api/axios'
import type { CreateOrderRequest, Order } from '@/types/order'

export function getOrders() {
  return api.get<Order[]>('/api/orders')
}

export function createOrder(payload: CreateOrderRequest) {
  return api.post<{ message?: string }>('/api/orders', payload)
}

export function cancelOrder(id: number) {
  return api.post<{ message?: string }>(`/api/orders/${id}/cancel`)
}
