<template>
  <div class="chart-card" :style="themeVars">
    <div class="chart-header">
      <h3>{{ title }}</h3>
    </div>

    <div v-if="items.length === 0" class="empty">暂无数据</div>

    <div v-else class="bar-list">
      <div v-for="item in normalizedItems" :key="item.label" class="bar-row">
        <div class="bar-label" :title="item.label">{{ item.label }}</div>

        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: item.displayPercent + '%' }"
          ></div>
        </div>

        <div class="bar-value">{{ item.value.toLocaleString() }}</div>
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
  '--chart-bar-track': CHART_THEME.bar.track,
  '--chart-bar-start': CHART_THEME.bar.start,
  '--chart-bar-end': CHART_THEME.bar.end,
}

const normalizedItems = computed(() => {
  const max = Math.max(...props.items.map((item) => Math.max(item.value, 0)), 1)

  return props.items.map((item) => {
    const safeValue = Math.max(item.value, 0)
    const percent = Math.round((safeValue / max) * 100)

    return {
      ...item,
      value: safeValue,
      percent,
      // 非 0 值给一个最小可见宽度，避免小数据完全看不见
      displayPercent: safeValue > 0 ? Math.max(percent, 4) : 0,
    }
  })
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

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

h3 {
  margin: 0;
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

.bar-list {
  display: grid;
  gap: 13px;
}

.bar-row {
  display: grid;
  grid-template-columns: 92px 1fr 92px;
  align-items: center;
  gap: 12px;
}

.bar-label {
  color: var(--chart-text);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-track {
  height: 9px;
  border-radius: 999px;
  background: var(--chart-bar-track);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--chart-bar-start),
    var(--chart-bar-end)
  );
  transition: width 0.25s ease;
}

.bar-value {
  color: var(--chart-text-secondary);
  font-size: 13px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
