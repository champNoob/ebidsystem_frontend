<template>
  <div class="main-layout">
    <header class="topbar">
      <div>
        <div class="brand">证券交易系统</div>
        <div v-if="user" class="user-line">{{ user.username }} · {{ roleLabel }}</div>
      </div>

      <button class="logout-button" @click="handleLogout">退出登录</button>
    </header>

    <div class="body">
      <aside class="sidebar">
        <RouterLink v-if="showOrders" to="/orders">订单查询</RouterLink>
        <RouterLink v-if="showPlaceOrder" to="/place-order">正式下单</RouterLink>
        <RouterLink to="/me">我的账户</RouterLink>
        <div v-if="showDraftTodo" class="todo-link">订单草稿（TODO）</div>
      </aside>

      <main class="content">
        <RouterView :key="route.fullPath" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth';
import { canPlaceFormalOrder } from '@/config/orderRules'

const router = useRouter()
const route = useRoute()
const { user, logout, currentRole  } = useAuth()

const showOrders = computed(() => currentRole.value === 'client' || currentRole.value === 'seller' || currentRole.value === 'trader')
const showPlaceOrder = computed(() => canPlaceFormalOrder(currentRole.value))
const showDraftTodo = computed(() => currentRole.value === 'sales')
const roleLabel = computed(() => {
  const map: Record<string, string> = {
    client: '客户',
    seller: '卖方',
    trader: '交易员',
    sales: '销售',
    admin: '管理员',
  }
  return currentRole.value ? map[currentRole.value] ?? currentRole.value : '未知角色'
})

async function handleLogout() {
  logout()
  await router.replace('/login')
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f8fafc;
}

.topbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #0f172a;
  color: #ffffff;
}

.brand {
  font-size: 18px;
  font-weight: 700;
}

.user-line {
  margin-top: 2px;
  color: #cbd5e1;
  font-size: 13px;
}

.logout-button {
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 14px;
  background: #1e293b;
  color: #ffffff;
  cursor: pointer;
}

.body {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: calc(100vh - 64px);
}

.sidebar {
  padding: 20px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

.sidebar a,
.todo-link {
  display: block;
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  text-decoration: none;
  font-size: 14px;
}

.sidebar a.router-link-active {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
}

.todo-link {
  color: #94a3b8;
  background: #f8fafc;
  cursor: not-allowed;
}

.content {
  padding: 28px;
}
</style>