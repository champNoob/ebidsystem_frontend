import axios from 'axios'

const TOKEN_KEY = 'token' // 与后端约定存储 key

const api = axios.create({
  baseURL: 'http://localhost:8080', // 后端实际地址
  timeout: 5000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
