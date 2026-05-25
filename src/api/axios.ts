import axios, {AxiosError} from 'axios'
import { getToken, removeToken } from '@/utils/storage'
import { notifyAuthStateCleared } from '@/utils/authEvents'

const api = axios.create({
  baseURL: 'http://localhost:8080', // 后端实际地址
  timeout: 5000
})

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken()
      notifyAuthStateCleared()
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown, fallback = '请求失败'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined
    return data?.message || data?.error || fallback
  }
  return fallback
}

export default api
