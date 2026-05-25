<template>
  <RouterView :key="route.fullPath" />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { isAuthenticated } = useAuth()

const publicPaths = ['/login', '/register']

watch(isAuthenticated, (loggedIn) => {
  if (!loggedIn && !publicPaths.includes(route.path)) {
    router.replace('/login')
  }
})
</script>
