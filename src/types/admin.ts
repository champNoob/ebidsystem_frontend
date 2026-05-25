import type { UserRole } from './auth'
import type { OrderStatus } from './order'

export interface AdminDashboardSummary {
  total_orders: number
  total_trades: number
  total_volume: number
  total_turnover: number
}

export interface SymbolStat {
  symbol: string
  volume: number
  turnover: number
}

export interface OrderStatusStat {
  status: OrderStatus | string
  count: number
}

export interface UserRoleStat {
  role: UserRole | string
  count: number
}

export interface UserRankingItem {
  user_id?: number
  username?: string
  total_volume: number
}

export interface TradeTimelineItem {
  time_bucket: string
  trades: number
  volume: number
  turnover: number
}

export interface RecentTrade {
  id: number
  event_id: string
  symbol: string
  buy_order_id: number
  sell_order_id: number
  price: number
  quantity: number
  created_at: string
}

export interface AdminUser {
  id: number
  username: string
  role: UserRole | string
  status?: string
  is_deleted?: boolean
}

export interface CreateAdminUserRequest {
  username: string
  password: string
  role: UserRole
}
