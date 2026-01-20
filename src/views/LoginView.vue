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
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await login(username.value, password.value)
    router.push('/orders') // 登录成功跳转下单页
  } catch (err: any) {
    // 显示后端返回的错误，如果没有，则显示默认
    if (err?.response?.data?.error) {
      errorMessage.value = err.response.data.error
    } else {
      errorMessage.value = '登录失败，请检查用户名或密码'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 360px;
  margin: 100px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.form-item { margin-bottom: 16px; }
.form-item label { display: block; margin-bottom: 4px; font-size: 14px; }
.form-item input { width: 100%; padding: 6px 8px; box-sizing: border-box; }
button { width: 100%; padding: 8px; }
.error { margin-bottom: 12px; color: red; font-size: 14px; }
</style>
