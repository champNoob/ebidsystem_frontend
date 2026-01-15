<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<template>
  <div v-if="user">
    <p>用户名：{{ user.username }}</p>
    <p>角色：{{ user.role }}</p>
  </div>
</template>
