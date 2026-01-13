import { ref, computed } from 'vue'
import { loginApi, LoginRequest } from '@/api/auth.api'

const TOKEN_KEY = 'token'

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const response = await loginApi({ username, password } as LoginRequest)
    const jwt = response.data.token
    if (!jwt) throw new Error('登录失败，未获取 token')
    localStorage.setItem(TOKEN_KEY, jwt)
    token.value = jwt
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    token.value = null
  }

  return { token, isAuthenticated, login, logout }
}
