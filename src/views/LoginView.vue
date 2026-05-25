<template>
  <div class="login-container">
    <h2>证券交易系统登录</h2>
    <!-- 登录表单 -->
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label>用户名</label>
        <input v-model="username" type="text" placeholder="请输入用户名" required />
      </div>

      <div class="form-item">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" required />
      </div>

      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
    <!-- 底部注册按钮 -->
    <div class="footer">
      还没有账号？
      <router-link to="/register">注册</router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiErrorMessage } from '@/api/axios'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, currentRole } = useAuth()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await login(username.value, password.value)
    // 登录成功则跳转：
    await router.push(currentRole.value === 'admin' ? '/admin/dashboard' : currentRole.value === 'sales' ? '/me' : '/orders')
  } catch (err: any) {
    // 显示后端返回的错误，如果没有，则显示默认
    if (err?.response?.data) {
      errorMessage.value =
        err.response.data.error ||
        err.response.data.message ||
        '登录失败，请检查用户名或密码'
    } else {
      errorMessage.value = getApiErrorMessage(err, '登录失败，请检查用户名或密码')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 360px;
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
}

h2 {
  margin: 0 0 22px;
  color: #0f172a;
  text-align: center;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 14px;
}

.form-item input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error {
  margin-bottom: 12px;
  color: #dc2626;
  font-size: 14px;
}

.footer {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}
</style>
