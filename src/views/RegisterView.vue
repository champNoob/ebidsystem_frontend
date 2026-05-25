<template>
  <div class="register-container">
    <h2>用户注册</h2>

    <form @submit.prevent="handleRegister">
      <div class="form-item">
        <label>用户名</label>
        <input v-model="username" required />
      </div>

      <div class="form-item">
        <label>密码</label>
        <input v-model="password" type="password" required />
      </div>

      <div class="form-item">
        <label>角色</label>
        <select v-model="role" required>
          <option value="client">普通客户（买）</option>
          <option value="seller">卖方（卖）</option>
          <option value="trader">交易员（买 / 卖）</option>
        </select>
      </div>

      <div v-if="message" :class="{ error: isError, success: !isError }">
        {{ message }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
    </form>

    <div class="footer">
      已有账号？
      <router-link to="/login">去登录</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiErrorMessage } from '@/api/axios'
import { registerApi } from '@/api/user.api'

const router = useRouter()

const username = ref('')
const password = ref('')
const role = ref<'client' | 'seller' | 'trader'>('client')

const loading = ref(false)
const message = ref('')
const isError = ref(false)

async function handleRegister() {
  message.value = ''
  isError.value = false
  loading.value = true

  try {
    await registerApi({
      username: username.value,
      password: password.value,
      role: role.value,
    })

    message.value = '注册成功，请登录'
    isError.value = false

    setTimeout(() => {
      router.push('/login')
    }, 800)
  }  catch (err) {
    message.value = getApiErrorMessage(err, '注册失败')
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  width: 400px;
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

label {
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 14px;
}

input,
select {
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

.error,
.success {
  margin-bottom: 12px;
  font-size: 14px;
}

.error {
  color: #dc2626;
}

.success {
  color: #16a34a;
}

.footer {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}
</style>
