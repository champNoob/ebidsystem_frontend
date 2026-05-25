<template>
  <div class="chart-card">
    <h3>{{ title }}</h3>
    <div v-if="items.length === 0" class="empty">暂无数据</div>
    <div v-else class="pie-layout">
      <div class="pie" :style="{ background: pieBackground }"></div>
      <div class="legend">
        <div v-for="item in legendItems" :key="item.label" class="legend-row">
          <span class="legend-dot" :style="{ background: item.color }"></span>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value.toLocaleString() }}</span>
        </div>
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

const palette = ['#2563eb', '#16a34a', '#f97316', '#7c3aed', '#dc2626', '#0891b2']

const total = computed(() => props.items.reduce((sum, item) => sum + Math.max(item.value, 0), 0))

const legendItems = computed(() => props.items.map((item, index) => ({
  ...item,
  color: palette[index % palette.length],
})))

const pieBackground = computed(() => {
  if (total.value <= 0) return '#e5e7eb'

  let cursor = 0
  const slices = legendItems.value.map((item) => {
    const start = cursor
    const end = cursor + (item.value / total.value) * 100
    cursor = end
    return `${item.color} ${start}% ${end}%`
  })
  return `conic-gradient(${slices.join(', ')})`
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

.pie-layout {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 18px;
}

.pie {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 8px solid #f8fafc;
}

.legend {
  display: grid;
  gap: 9px;
}

.legend-row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 13px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-value {
  color: #0f172a;
  font-weight: 600;
}
</style>
