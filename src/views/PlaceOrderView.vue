<template>
  <div class="order-container">
    <h2>下单页</h2>

    <form @submit.prevent="handlePlaceOrder">
      <div class="form-item">
        <label>股票代码</label>
        <input v-model="symbol" type="text" placeholder="如 AAPL" required />
      </div>

      <div class="form-item">
        <label>买卖方向</label>
        <select v-model="side" required>
          <option disabled value="">
            请选择买卖方向
          </option>
          <option
            v-for="s in allowedSides"
            :key="s"
            :value="s"
          >
            {{ ORDER_SIDE_LABEL[s] }}
          </option>
        </select>
      </div>

      <div class="form-item">
        <label>价格（限价单）</label>
        <input v-model.number="price" type="number" step="0.01" required />
      </div>

      <div class="form-item">
        <label>数量</label>
        <input v-model.number="quantity" type="number" min="1" required />
      </div>

      <div v-if="message" :class="{'error': isError, 'success': !isError}">
        {{ message }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '提交中...' : '提交订单' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { loginApi, LoginRequest } from '@/api/auth.api'
import api from '@/api/axios' // Axios 已封装自动带 token
import { useAuth } from '@/composables/useAuth'
import { ROLE_ALLOWED_SIDES, ORDER_SIDE_LABEL } from '@/config/orderRules'
import type { OrderSide, UserRole } from '@/config/orderRules'

const { user } = useAuth()

const symbol = ref('')
const side = ref<OrderSide | ''>('')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)

const loading = ref(false)
const message = ref('')
const isError = ref(false)

// 根据用户角色计算允许的买卖方向
const allowedSides = computed<OrderSide[]>(() => {
  const role = user.value?.role as UserRole | undefined
  if (!role) return []
  return ROLE_ALLOWED_SIDES[role] || []
})

// 当角色或 allowedSides 变化时，自动修正 side
watch(
  () => user.value?.role,
  (role: UserRole | undefined) => {
    if (!role) {
      side.value = ''
      return
    }

    const sides = ROLE_ALLOWED_SIDES[role]
    if (sides.length > 0) {
      side.value = sides[0]
    }
  },
  { immediate: true }
)

// Watch user changes for debugging
watch(
  () => user.value,
  (u) => {
    console.log('user changed:', u)
  },
  { immediate: true }
)


async function handlePlaceOrder() {
  message.value = ''
  isError.value = false
  loading.value = true

  if (!side.value) {
    message.value = '买卖方向非法'
    isError.value = true
    loading.value = false
    return
  }

  try {
    const response = await api.post('/api/orders', {
      type: "limit",
      symbol: symbol.value,
      side: side.value,
      price: price.value,
      quantity: quantity.value,
    })
    message.value = response.data.message || '下单成功'
    isError.value = false
  } catch (err: any) {
    message.value =
      err?.response?.data?.error || '下单失败，请稍后重试'
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.order-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-item { margin-bottom: 16px; }
.form-item label { display: block; margin-bottom: 4px; font-size: 14px; }
.form-item input, .form-item select { width: 100%; padding: 6px 8px; box-sizing: border-box; }

button { width: 100%; padding: 8px; }

.success { color: green; margin-bottom: 12px; }
.error { color: red; margin-bottom: 12px; }
</style>
