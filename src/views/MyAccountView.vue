<template>
  <div class="page-card account-view">
    <h2>我的账户</h2>

    <div v-if="user" class="info-grid">
      <div class="info-item">
        <span>ID</span>
        <strong>{{ user.id }}</strong>
      </div>
      <div class="info-item">
        <span>用户名</span>
        <strong>{{ user.username }}</strong>
      </div>
      <div class="info-item">
        <span>角色</span>
        <strong>{{ user.role }}</strong>
      </div>
    </div>

    <div v-else class="empty">当前用户信息加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<style scoped>
.account-view {
  max-width: 720px;
}

h2 {
  margin: 0 0 18px;
  color: #0f172a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.info-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f8fafc;
}

.info-item span {
  display: block;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
}

.info-item strong {
  color: #0f172a;
  font-size: 18px;
}

.empty {
  color: #94a3b8;
}
</style>
