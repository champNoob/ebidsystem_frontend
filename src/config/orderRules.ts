// 订单方向类型（领域模型）：
export type OrderSide = 'buy' | 'sell'
// 订单方向显示文案：
export const ORDER_SIDE_LABEL: Record<OrderSide, string> = {
  buy: '买入',
  sell: '卖出',
}

// 用户角色类型：
export type UserRole = 'client' | 'seller' | 'trader' | 'sales' | 'admin'
// 角色 → 允许下单方向：
export const ROLE_ALLOWED_SIDES: Record<UserRole, OrderSide[]> = {
  client: ['buy'],
  seller: ['sell'],
  trader: ['buy', 'sell'],
  sales: ['buy', 'sell'],
  admin: ['buy', 'sell'],
}
