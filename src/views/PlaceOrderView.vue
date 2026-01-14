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
          <option value="buy">买入</option>
          <option value="sell">卖出</option>
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
import { ref } from 'vue'
import api from '@/api/axios' // Axios 已封装自动带 token

const symbol = ref('')
const side = ref<'buy' | 'sell'>('buy')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)
const loading = ref(false)
const message = ref('')
const isError = ref(false)

async function handlePlaceOrder() {
  message.value = ''
  isError.value = false
  loading.value = true

  try {
    const response = await api.post('/api/orders', {
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
