import api from '@/api/axios'
import type {
  AdminDashboardSummary,
  AdminUser,
  CreateAdminUserRequest,
  OrderStatusStat,
  RecentTrade,
  SymbolStat,
  TradeTimelineItem,
  UserRankingItem,
  UserRoleStat,
} from '@/types/admin'

export function getAdminDashboard() {
  return api.get<AdminDashboardSummary>('/api/admin/dashboard')
}

export function getSymbolStats() {
  return api.get<SymbolStat[]>('/api/admin/dashboard/symbols')
}

export function getOrderStatusStats() {
  return api.get<OrderStatusStat[]>('/api/admin/dashboard/order-status')
}

export function getUserRoleStats() {
  return api.get<UserRoleStat[]>('/api/admin/dashboard/user-roles')
}

export function getUserRanking() {
  return api.get<UserRankingItem[]>('/api/admin/dashboard/user-ranking')
}

export function getTradeTimeline() {
  return api.get<TradeTimelineItem[]>('/api/admin/dashboard/trades/timeline')
}

export function getRecentTrades(limit = 20) {
  return api.get<RecentTrade[]>('/api/admin/trades/recent', {
    params: { limit },
  })
}

export function getAdminUserById(id: number) {
  return api.get<AdminUser>(`/api/admin/users/${id}`)
}

export function createAdminUser(payload: CreateAdminUserRequest) {
  return api.post<{ message?: string }>('/api/admin/users/create', payload)
}
