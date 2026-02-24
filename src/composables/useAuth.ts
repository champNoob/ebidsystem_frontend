import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
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

function useLogoutLogic() {
  const router = useRouter()

  return function logout() {
    // 删除 token：
    localStorage.removeItem(TOKEN_KEY)
    token.value = null
    // 清空用户信息：
    user.value = null
    // 强制跳转到登录页：
    router.push('/login')
  }
}

async function fetchMe() {
  if (!token.value) return

  loadingMe.value = true
  try {
    const res = await api.get('/api/me')
    user.value = res.data
  } catch (err) {
    // token 失效或后端异常，直接清理
    localStorage.removeItem(TOKEN_KEY)
    token.value = null
    user.value = null
    throw err
  } finally {
    loadingMe.value = false
  }
}


export function useAuth() {
  const logout = useLogoutLogic()

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
