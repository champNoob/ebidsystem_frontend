<template>
  <div class="page-card orders-container">
    <div class="page-header">
      <div>
        <h2>订单查询</h2>
      </div>
      <button @click="fetchOrders" :disabled="loading">刷新</button>
    </div>

    <div class="filter-bar">
      <label>
        订单类型：
        <select v-model="scope">
          <option value="current">当前订单</option>
          <option value="history">历史订单</option>
          <option value="all">全部订单</option>
        </select>
      </label>
    </div>

    <div v-if="error" class="notice error">{{ error }}</div>
    <div v-if="actionMessage" :class="['notice', actionIsError ? 'error' : 'success']">
      {{ actionMessage }}
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Symbol</th>
          <th>方向</th>
          <th>价格</th>
          <th>数量</th>
          <th>已成交</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="filteredOrders.length === 0">
          <td colspan="8" class="empty">暂无订单</td>
        </tr>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.symbol }}</td>
          <td>{{ order.side }}</td>
          <td>{{ order.price }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.filled_quantity }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button
              v-if="canCancel(order.status)"
              class="small-button danger"
              @click="handleCancelOrder(order.id)"
            >
              撤单
            </button>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getApiErrorMessage } from '@/api/axios'
import { cancelOrder, getOrders } from '@/api/order.api'
import type { Order, OrderScope, OrderStatus } from '@/types/order'

const orders = ref<Order[]>([])
const scope = ref<OrderScope>('current')
const loading = ref(false)
const error = ref('')
const actionMessage = ref('')
const actionIsError = ref(false)

const currentStatuses: OrderStatus[] = ['pending', 'partial']
const historyStatuses: OrderStatus[] = ['filled', 'cancelled']

const filteredOrders = computed(() => {
  if (scope.value === 'all') return orders.value
  const accepted = scope.value === 'current' ? currentStatuses : historyStatuses
  return orders.value.filter((order) => accepted.includes(order.status))
})

function canCancel(status: OrderStatus) {
  return status === 'pending' || status === 'partial'
}

async function fetchOrders() {
  error.value = ''
  loading.value = true
  try {
    const response = await getOrders()
    orders.value = response.data
  } catch (requestError) {
    error.value = getApiErrorMessage(requestError, '获取订单失败')
  } finally {
    loading.value = false
  }
}

async function handleCancelOrder(id: number) {
  actionMessage.value = ''
  actionIsError.value = false

  try {
    await cancelOrder(id)
    actionMessage.value = '撤单请求已提交，订单列表已刷新。'
    await fetchOrders()
  } catch (requestError) {
    actionMessage.value = getApiErrorMessage(requestError, '撤单失败')
    actionIsError.value = true
  }
}

onMounted(fetchOrders)
</script>

<style scoped>
.orders-container {
  overflow-x: auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
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

.filter-bar {
  margin-bottom: 16px;
}

select {
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 8px;
  text-align: center;
  font-size: 14px;
}

th {
  background: #f8fafc;
  color: #334155;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}

.small-button {
  padding: 5px 9px;
  font-size: 13px;
}

.danger {
  background: #dc2626;
}

.error {
  margin-bottom: 12px;
  color: #dc2626;
}

.success {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}


.empty {
  padding: 28px;
  color: #94a3b8;
}
</style>
