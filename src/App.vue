<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<template>
  <div>
    <div v-if="user">
      当前用户：{{ user.username }}（{{ user.role }}）
    </div>
    <nav>
      <RouterLink to="/place-order">下单</RouterLink>
      <RouterLink to="/orders">当前订单</RouterLink>
      <RouterLink to="/me">我的账户</RouterLink>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
