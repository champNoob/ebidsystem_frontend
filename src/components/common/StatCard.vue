<template>
  <section class="stat-card">
    <div class="stat-title">{{ title }}</div>
    <div class="stat-value">{{ formattedValue }}</div>
    <div v-if="description" class="stat-description">{{ description }}</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  description?: string
}>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>

<style scoped>
.stat-card {
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.stat-title {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  color: #0f172a;
  font-size: 26px;
  font-weight: 700;
}

.stat-description {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 6px;
}
</style>
