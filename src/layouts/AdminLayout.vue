<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-title">Admin Console</div>
      <RouterLink to="/admin/dashboard">管理员看板</RouterLink>
      <RouterLink to="/admin/users">用户管理</RouterLink>
      <RouterLink to="/admin/orders">订单管理</RouterLink>
      <RouterLink to="/admin/trades">成交管理</RouterLink>
    </aside>

    <section class="admin-main">
      <header class="admin-topbar">
        <div>
          <div class="page-title">证券交易系统后台</div>
          <div v-if="user" class="user-line">{{ user.username }} · {{ user.role }}</div>
        </div>
        <button class="logout-button" @click="handleLogout">退出登录</button>
      </header>

      <main class="admin-content">
        <RouterView :key="route.fullPath" />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()

async function handleLogout() {
  logout()
  await router.replace('/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: #f1f5f9;
}

.admin-sidebar {
  padding: 24px 18px;
  background: #020617;
  color: #ffffff;
}

.admin-title {
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 800;
}

.admin-sidebar a {
  display: block;
  margin-bottom: 10px;
  padding: 11px 12px;
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
}

.admin-sidebar a.router-link-active {
  background: #1d4ed8;
  color: #ffffff;
  font-weight: 700;
}

.admin-main {
  min-width: 0;
}

.admin-topbar {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  color: #0f172a;
  font-size: 18px;
  font-weight: 700;
}

.user-line {
  color: #64748b;
  font-size: 13px;
  margin-top: 2px;
}

.logout-button {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 14px;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
}

.admin-content {
  padding: 28px;
}
</style>
