<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <RouterLink to="/place-order">下单</RouterLink>
        <RouterLink to="/orders">当前订单</RouterLink>
        <RouterLink to="/me">我的账户</RouterLink>
      </nav>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.header {
  background: #1f2937;
  padding: 12px 24px;
}

.nav a {
  color: #e5e7eb;
  margin-right: 16px;
  text-decoration: none;
}

.nav a.router-link-active {
  font-weight: bold;
  color: #60a5fa;
}

.content {
  padding: 24px;
}
</style>
