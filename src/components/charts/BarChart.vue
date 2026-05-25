<template>
  <div class="chart-card">
    <h3>{{ title }}</h3>
    <div v-if="items.length === 0" class="empty">暂无数据</div>
    <div v-else class="bar-list">
      <div v-for="item in normalizedItems" :key="item.label" class="bar-row">
        <div class="bar-label">{{ item.label }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: item.percent + '%' }"></div>
        </div>
        <div class="bar-value">{{ item.value.toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartItem {
  label: string
  value: number
}

const props = defineProps<{
  title: string
  items: ChartItem[]
}>()

const normalizedItems = computed(() => {
  const max = Math.max(...props.items.map((item) => item.value), 1)
  return props.items.map((item) => ({
    ...item,
    percent: Math.round((item.value / max) * 100),
  }))
})
</script>

<style scoped>
.chart-card {
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

h3 {
  margin: 0 0 16px;
  color: #0f172a;
  font-size: 16px;
}

.empty {
  color: #94a3b8;
  font-size: 14px;
}

.bar-list {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 90px 1fr 90px;
  align-items: center;
  gap: 10px;
}

.bar-label {
  color: #334155;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-track {
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: #2563eb;
}

.bar-value {
  color: #475569;
  font-size: 13px;
  text-align: right;
}
</style>
