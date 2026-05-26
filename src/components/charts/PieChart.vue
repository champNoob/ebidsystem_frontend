<template>
  <div class="chart-card" :style="themeVars">
    <h3>{{ title }}</h3>

    <div v-if="items.length === 0" class="empty">暂无数据</div>

    <div v-else class="pie-layout">
      <div class="pie-wrap">
        <div class="pie" :style="{ background: pieBackground }"></div>
      </div>

      <div class="legend">
        <div v-for="item in legendItems" :key="item.label" class="legend-row">
          <span class="legend-dot" :style="{ background: item.color }"></span>
          <span class="legend-label" :title="item.label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CHART_THEME } from '@/config/chartTheme'

interface ChartItem {
  label: string
  value: number
}

const props = defineProps<{
  title: string
  items: ChartItem[]
}>()

const themeVars = {
  '--chart-card-bg': CHART_THEME.card.background,
  '--chart-card-border': CHART_THEME.card.border,
  '--chart-card-shadow': CHART_THEME.card.shadow,
  '--chart-title': CHART_THEME.text.title,
  '--chart-text': CHART_THEME.text.primary,
  '--chart-text-secondary': CHART_THEME.text.secondary,
  '--chart-empty': CHART_THEME.text.muted,
  '--chart-pie-border': CHART_THEME.pie.border,
  '--chart-pie-center': CHART_THEME.pie.center,
}

const total = computed(() =>
  props.items.reduce((sum, item) => sum + Math.max(item.value, 0), 0)
)

const legendItems = computed(() =>
  props.items.map((item, index) => ({
    ...item,
    value: Math.max(item.value, 0),
    color: CHART_THEME.palette[index % CHART_THEME.palette.length],
  }))
)

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
  border: 1px solid var(--chart-card-border);
  border-radius: 16px;
  background: var(--chart-card-bg);
  box-shadow: var(--chart-card-shadow);
}

h3 {
  margin: 0 0 16px;
  color: var(--chart-title);
  font-size: 16px;
  font-weight: 650;
  letter-spacing: 0.01em;
}

.empty {
  padding: 22px 0;
  color: var(--chart-empty);
  font-size: 14px;
  text-align: center;
}

.pie-layout {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  gap: 20px;
}

.pie-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie {
  position: relative;
  width: 148px;
  height: 148px;
  aspect-ratio: 1 / 1;
  flex: none;
  box-sizing: border-box;
  border-radius: 50%;
  border: 8px solid var(--chart-pie-border);
  box-shadow:
    inset 0 0 0 1px rgba(15, 23, 42, 0.04),
    0 8px 18px rgba(15, 23, 42, 0.06);
}

.pie::after {
  content: '';
  position: absolute;
  inset: 36px;
  border-radius: 50%;
  background: var(--chart-pie-center);
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.legend {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.legend-row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 9px;
  color: var(--chart-text-secondary);
  font-size: 13px;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
}

.legend-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-value {
  color: var(--chart-text);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
</style>