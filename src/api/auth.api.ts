import api from './axios'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

// 登录接口：POST /login
export function loginApi(data: LoginRequest) {
  return api.post<LoginResponse>('/login', data)
}

// 获取当前用户信息：GET /api/me
export interface MeResponse {
  id: number
  username: string
  role: 'client' | 'trader' | 'seller' | 'admin'
}

export function getCurrentUser() {
  return api.get<MeResponse>('/api/me')
}
