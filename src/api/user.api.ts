import api from '@/api/axios'

export interface RegisterRequest { //不允许 admin / sales
  username: string
  password: string
  role: 'client' | 'seller' | 'trader'
}

export function registerApi(data: RegisterRequest) {
  return api.post('/users', data)
}
