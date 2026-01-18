import { ref, computed } from 'vue'
import { loginApi, LoginRequest } from '@/api/auth.api'
import api from '@/api/axios'

const TOKEN_KEY = 'token'

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
const user = ref<any | null>(null)
const loadingMe = ref(false)
const isAuthenticated = computed(() => !!token.value)

async function login(username: string, password: string) {
  const response = await loginApi({ username, password } as LoginRequest)
  const jwt = response.data.token
  if (!jwt) {
    throw new Error('登录失败，未获取 token')
  }

  localStorage.setItem(TOKEN_KEY, jwt)
  token.value = jwt

  await fetchMe() //登录成功后，立即拉取用户信息
}

function logout() {
  localStorage.removeItem(TOKEN_KEY)
  token.value = null
  user.value = null
}

async function fetchMe() {
  if (!token.value) return

  loadingMe.value = true
  try {
    const res = await api.get('/api/me')
    user.value = res.data
  } catch (err) {
    // token 失效或后端异常，直接清理
    logout()
    throw err
  } finally {
    loadingMe.value = false
  }
}


export function useAuth() {
  return { 
    // state:
    token,
    user,
    loadingMe,
    // computed:
    isAuthenticated,
    // actions:
    login,
    logout,
    fetchMe,
  }
}
