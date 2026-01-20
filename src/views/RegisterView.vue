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

      <div v-if="message" :class="{ error: isError }">
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
  } catch (err: any) {
    message.value =
      err?.response?.data?.error || '注册失败'
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-item {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
}

input, select {
  width: 100%;
  padding: 6px;
}

button {
  width: 100%;
  padding: 8px;
}

.error {
  color: red;
  margin-top: 8px;
}

.footer {
  margin-top: 16px;
  text-align: center;
}
</style>
