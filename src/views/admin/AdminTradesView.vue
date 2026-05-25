<template>
  <div class="panel trades-view">
    <div class="page-heading">
      <div>
        <h2>成交管理</h2>
        <p>当前仅使用已实现接口：GET /api/admin/trades/recent。</p>
      </div>
      <div class="toolbar">
        <label>
          最近条数：
          <select v-model.number="limit">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </label>
        <button @click="loadTrades" :disabled="loading">刷新</button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Event ID</th>
          <th>Symbol</th>
          <th>Buy Order</th>
          <th>Sell Order</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="trades.length === 0">
          <td colspan="8" class="empty">暂无成交记录</td>
        </tr>
        <tr v-for="trade in trades" :key="trade.id">
          <td>{{ trade.id }}</td>
          <td>{{ trade.event_id }}</td>
          <td>{{ trade.symbol }}</td>
          <td>{{ trade.buy_order_id }}</td>
          <td>{{ trade.sell_order_id }}</td>
          <td>{{ trade.price }}</td>
          <td>{{ trade.quantity }}</td>
          <td>{{ trade.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/api/axios'
import { getRecentTrades } from '@/api/admin'
import type { RecentTrade } from '@/types/admin'

const limit = ref(20)
const loading = ref(false)
const error = ref('')
const trades = ref<RecentTrade[]>([])

async function loadTrades() {
  loading.value = true
  error.value = ''

  try {
    const response = await getRecentTrades(limit.value)
    trades.value = response.data
  } catch (requestError) {
    error.value = getApiErrorMessage(requestError, '获取最近成交失败')
  } finally {
    loading.value = false
  }
}

watch(limit, loadTrades)
onMounted(loadTrades)
</script>

<style scoped>
.panel {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.page-heading {
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

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

select {
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 8px;
  text-align: center;
  font-size: 13px;
}

th {
  background: #f8fafc;
  color: #334155;
}

.error {
  margin-bottom: 12px;
  color: #dc2626;
}

.empty {
  padding: 28px;
  color: #94a3b8;
}
</style>
