import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi, LoginRequest } from '@/api/auth.api'
import api from '@/api/axios'
import { getToken, setToken, removeToken } from '@/utils/storage'

const token = ref<string | null>(getToken())
const user = ref<any | null>(null)
const loadingMe = ref(false)
const isAuthenticated = computed(() => !!token.value)

async function login(username: string, password: string) {
  const response = await loginApi({ username, password } as LoginRequest)
  const jwt = response.data.token
  if (!jwt) {
    throw new Error('登录失败，未获取 token')
  }

  setToken(jwt)
  token.value = jwt

  await fetchMe() //登录成功后，立即拉取用户信息
}

function useLogoutLogic() {
  const router = useRouter()

  return function logout() {
    // 删除 token：
    removeToken()
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
    removeToken()
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
