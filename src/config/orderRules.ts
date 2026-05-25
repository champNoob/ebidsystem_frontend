import type { UserRole } from '@/types/auth'
import type { OrderSide } from '@/types/order'

// 订单方向显示文案：
export const ORDER_SIDE_LABEL: Record<OrderSide, string> = {
  buy: '买入',
  sell: '卖出',
}

// 角色 → 允许下单方向：
export const ROLE_ALLOWED_SIDES: Record<UserRole, OrderSide[]> = {
  client: ['buy'],
  seller: ['sell'],
  trader: ['buy', 'sell'],
  sales: [],
  admin: [],
}

export function canPlaceFormalOrder(role: UserRole | undefined): boolean {
  return role === 'client' || role === 'seller' || role === 'trader'
}

export function getAllowedSides(role: UserRole | undefined): OrderSide[] {
  if (!role) return []
  return ROLE_ALLOWED_SIDES[role] ?? []
}