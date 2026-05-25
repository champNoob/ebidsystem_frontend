// 用户角色类型：
export type UserRole = 'client' | 'seller' | 'trader' | 'sales' | 'admin'

export interface CurrentUser {
  id: number
  username: string
  role: UserRole
  is_deleted?: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}
