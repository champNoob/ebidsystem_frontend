<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-title">Admin Console</div>
      <button
        v-for="item in navItems"
        :key="item.path"
        type="button"
        class="nav-button"
        :class="{ active: route.path === item.path }"
        @click="go(item.path)"
      >
        {{ item.label }}
      </button>
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
        <RouterView v-slot="{ Component, route }">
          <KeepAlive>
            <component
              v-if="route.meta.keepAlive"
              :is="Component"
              :key="route.name ?? route.path"
            />
          </KeepAlive>

          <component
            v-if="!route.meta.keepAlive"
            :is="Component"
            :key="route.fullPath"
          />
        </RouterView>
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

const navItems = [
  { label: '管理员看板', path: '/admin/dashboard' },
  { label: '用户管理', path: '/admin/users' },
  { label: '订单管理', path: '/admin/orders' },
  { label: '成交管理', path: '/admin/trades' },
]

async function go(path: string) {
  if (route.path !== path) {
    await router.push(path)
  }
}

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

.nav-button {
  width: 100%;
  display: block;
  margin-bottom: 10px;
  padding: 11px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #cbd5e1;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.nav-button:hover {
  background: #0f172a;
  color: #ffffff;
}

.nav-button.active {
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
