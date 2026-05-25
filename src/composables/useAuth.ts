import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi, getCurrentUser } from '@/api/auth.api'
import { onAuthStateCleared } from '@/utils/authEvents'
import { getToken, setToken, removeToken } from '@/utils/storage'
import type { CurrentUser, LoginRequest, UserRole } from '@/types/auth'

const token = ref<string | null>(getToken())
const user = ref<CurrentUser | null>(null)
const loadingMe = ref(false)
const isAuthenticated = computed(() => !!token.value)
const currentRole = computed<UserRole | undefined>(() => user.value?.role)

async function login(username: string, password: string) {
  const payload: LoginRequest = { username, password }
  const response = await loginApi(payload)
  const jwt = response.data.token
  if (!jwt) {
    throw new Error('登录失败，未获取 token')
  }

  setToken(jwt)
  token.value = jwt

  await fetchMe() //登录成功后，立即拉取用户信息
}

function clearAuthState() {
  removeToken() //token失效或后端异常，直接清理
  token.value = null
  user.value = null //清空用户信息
}

onAuthStateCleared(clearAuthState)

function logout() {
  clearAuthState()
  useRouter().push('/login') //# 强制跳转到登录页
}



async function fetchMe() {
  if (!token.value) return

  loadingMe.value = true
  try {
    const res = await getCurrentUser()
    user.value = res.data
    return res.data
  } catch (err) {
    clearAuthState()
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
    currentRole,
    // actions:
    login,
    logout,
    fetchMe,
    clearAuthState,
  }
}
