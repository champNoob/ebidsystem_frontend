// 订单方向类型（领域模型）：
export type OrderSide = 'buy' | 'sell'
// 订单类型：
export type OrderType = 'limit'
// 订单状态：
export type OrderStatus = 'pending' | 'partial' | 'filled' | 'cancelled'
// 订单范围：
export type OrderScope = 'current' | 'history' | 'all'

export interface Order {
  id: number
  symbol: string
  side: OrderSide
  price: number
  quantity: number
  filled_quantity: number
  status: OrderStatus
}

export interface CreateOrderRequest {
  symbol: string
  type: OrderType
  side: OrderSide
  price: number
  quantity: number
}
