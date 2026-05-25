<template>
  <div class="page-card order-page">
    <div class="page-header">
      <div>
        <h2>正式下单</h2>
        <p>当前仅支持限价单，成交与权限合法性最终由后端判定。</p>
      </div>
    </div>

    <div v-if="!canSubmitFormalOrder" class="warning-box">
      当前角色不能提交正式订单。sales 只能使用订单草稿模块；admin 不直接提交正式订单。
    </div>

    <form v-else @submit.prevent="handlePlaceOrder" class="order-form">
      <div class="form-item">
        <label>股票代码</label>
        <input v-model.trim="symbol" type="text" placeholder="如 AAPL" required />
      </div>

      <div class="form-item">
        <label>订单类型</label>
        <select v-model="orderType" disabled>
          <option value="limit">限价单</option>
        </select>
        <small>后端当前只支持限价单，市价单暂不开放。</small>
      </div>

      <div class="form-item">
        <label>买卖方向</label>
        <select v-model="side" required>
          <option disabled value="">请选择买卖方向</option>
          <option v-for="item in allowedSides" :key="item" :value="item">
            {{ ORDER_SIDE_LABEL[item] }}
          </option>
        </select>
      </div>

      <div class="form-item">
        <label>价格</label>
        <input v-model.number="price" type="number" min="0.01" step="0.01" required />
      </div>

      <div class="form-item">
        <label>数量</label>
        <input v-model.number="quantity" type="number" min="1" step="1" required />
      </div>

      <div v-if="message" :class="{ error: isError, success: !isError }">
        {{ message }}
      </div>

      <button type="submit" :disabled="loading || !side">
        {{ loading ? '提交中...' : '提交订单' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/api/axios'
import { createOrder } from '@/api/order.api'
import { useAuth } from '@/composables/useAuth'
import { canPlaceFormalOrder, getAllowedSides, ORDER_SIDE_LABEL } from '@/config/orderRules'
import type { OrderSide, OrderType } from '@/types/order'

const { currentRole } = useAuth()

const symbol = ref('')
const orderType = ref<OrderType>('limit')
const side = ref<OrderSide | ''>('')
const price = ref<number | null>(null)
const quantity = ref<number | null>(null)
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const allowedSides = computed(() => getAllowedSides(currentRole.value))
const canSubmitFormalOrder = computed(() => canPlaceFormalOrder(currentRole.value))

watch(
  allowedSides,
  (sides) => {
    if (sides.length === 0) {
      side.value = ''
      return
    }

    if (!side.value || !sides.includes(side.value)) {
      side.value = sides[0]
    }
  },
  { immediate: true },
)

async function handlePlaceOrder() {
  message.value = ''
  isError.value = false

  if (!side.value || !canSubmitFormalOrder.value) {
    message.value = '当前角色不允许提交该方向的正式订单'
    isError.value = true
    return
  }

  if (price.value === null || quantity.value === null) {
    message.value = '价格和数量不能为空'
    isError.value = true
    return
  }

  loading.value = true
  try {
    const response = await createOrder({
      symbol: symbol.value,
      type: orderType.value,
      side: side.value,
      price: price.value,
      quantity: quantity.value,
    })

    message.value = response.data.message === 'order created'
      ? '订单创建成功，已提交至撮合系统。'
      : response.data.message || '订单创建成功，已提交至撮合系统。'
    isError.value = false
    symbol.value = ''
    price.value = null
    quantity.value = null
  } catch (error) {
    message.value = getApiErrorMessage(error, '下单失败')
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.order-page {
  max-width: 560px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

h2 {
  margin: 0;
  color: #0f172a;
}

p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
}

.order-form {
  display: grid;
  gap: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 14px;
}

.form-item input,
.form-item select {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.form-item small {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
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

.warning-box {
  padding: 14px;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  background: #fff7ed;
  color: #9a3412;
}


.error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
}

.success {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
  font-weight: 600;
}
</style>
