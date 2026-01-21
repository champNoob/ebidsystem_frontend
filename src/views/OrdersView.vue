<template>
  <div class="orders-container">
    <h2>{{ title }}</h2>

    <div class="filter-bar">
      <label>
        订单类型：
        <select v-model="statusFilter" @change="fetchOrders">
          <option value="current">当前订单</option>
          <option value="history">历史订单</option>
          <option value="all">全部订单</option>
        </select>
      </label>
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
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.symbol }}</td>
          <td>{{ order.side }}</td>
          <td>{{ order.price }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.filled_quantity }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button
              v-if="order.status === 'pending' || order.status === 'partial'"
              @click="cancelOrder(order.id)"
            >
              撤单
            </button>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'

type OrderView = 'current' | 'history' | 'all'

interface Order {
  id: number
  symbol: string
  side: 'buy' | 'sell'
  price: number
  quantity: number
  filled_quantity: number
  status: 'pending' | 'partial' | 'filled' | 'cancelled'
}

const orders = ref<Order[]>([])
const error = ref('')
const statusFilter = ref<'current' | 'history'>('current')
const title = computed(() =>
  statusFilter.value === 'current' ? '当前订单' : '历史订单'
)

async function fetchOrders() {
  error.value = ''
  try {
    const res = await api.get('/api/orders', {
      params: {
        status: statusFilter.value
      }
    })
    orders.value = res.data
  } catch (e: any) {
    error.value = e?.response?.data?.error || '获取订单失败'
  }
}

async function cancelOrder(id: number) {
  try {
    await api.post(`/api/orders/${id}/cancel`)
    await fetchOrders()
  } catch (e: any) {
    alert(e?.response?.data?.error || '撤单失败')
  }
}

onMounted(fetchOrders)
</script>

<style scoped>
.orders-container {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: center;
}

button {
  padding: 4px 8px;
}

.error {
  margin-top: 12px;
  color: red;
}
</style>
