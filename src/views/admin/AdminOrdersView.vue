<template>
  <div class="panel admin-orders-view">
    <h2>订单管理</h2>

    <div class="filters">
      <div class="form-item">
        <label>用户 ID</label>
        <input v-model="filters.userId" placeholder="TODO" disabled />
      </div>
      <div class="form-item">
        <label>Symbol</label>
        <input v-model="filters.symbol" placeholder="TODO" disabled />
      </div>
      <div class="form-item">
        <label>Status</label>
        <select v-model="filters.status" disabled>
          <option value="">全部</option>
          <option value="pending">pending</option>
          <option value="partial">partial</option>
          <option value="filled">filled</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>
      <div class="form-item">
        <label>Page</label>
        <input v-model="filters.page" disabled />
      </div>
      <div class="form-item">
        <label>Page Size</label>
        <input v-model="filters.pageSize" disabled />
      </div>
    </div>

    <button disabled>查询订单（后端接口待实现）</button>

    <div class="todo-box">
      TODO：后端实现 /api/admin/orders 后，在此处接入真实分页、筛选与表格展示。
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const filters = reactive({
  userId: '',
  symbol: '',
  status: '',
  page: '1',
  pageSize: '20',
})
</script>

<style scoped>
.panel {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

h2 {
  margin: 0 0 8px;
  color: #0f172a;
}

p {
  max-width: 760px;
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.filters {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.form-item label {
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
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background: #cbd5e1;
  color: #475569;
  cursor: not-allowed;
}

.todo-box {
  margin-top: 16px;
  padding: 14px;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
}
</style>
