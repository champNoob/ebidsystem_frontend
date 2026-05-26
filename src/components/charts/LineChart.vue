<template>
  <div class="chart-card" :style="themeVars">
    <h3>{{ title }}</h3>

    <div v-if="points.length === 0" class="empty">暂无数据</div>

    <svg v-else class="line-chart" viewBox="0 0 600 240" role="img">
      <polyline class="grid-line" points="40,40 580,40" />
      <polyline class="grid-line" points="40,120 580,120" />
      <polyline class="grid-line" points="40,200 580,200" />

      <polyline class="axis" points="40,20 40,205 580,205" />

      <polygon class="area" :points="areaPolygonPoints" />
      <polyline class="line" :points="polylinePoints" />

      <circle
        v-for="point in normalizedPoints"
        :key="point.label"
        class="point"
        :cx="point.x"
        :cy="point.y"
        r="3.8"
      />

      <text
        v-for="point in labelPoints"
        :key="point.label + '-label'"
        class="x-label"
        :x="point.x"
        y="230"
      >
        {{ point.shortLabel }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CHART_THEME } from '@/config/chartTheme'

interface ChartPoint {
  label: string
  value: number
}

const props = defineProps<{
  title: string
  points: ChartPoint[]
}>()

const themeVars = {
  '--chart-card-bg': CHART_THEME.card.background,
  '--chart-card-border': CHART_THEME.card.border,
  '--chart-card-shadow': CHART_THEME.card.shadow,
  '--chart-title': CHART_THEME.text.title,
  '--chart-empty': CHART_THEME.text.muted,
  '--chart-grid': CHART_THEME.axis.grid,
  '--chart-axis': CHART_THEME.axis.line,
  '--chart-line': CHART_THEME.line.stroke,
  '--chart-point': CHART_THEME.line.point,
  '--chart-area': CHART_THEME.line.area,
  '--chart-label': CHART_THEME.text.secondary,
}

const normalizedPoints = computed(() => {
  const max = Math.max(...props.points.map((point) => Math.max(point.value, 0)), 1)
  const step = props.points.length > 1 ? 540 / (props.points.length - 1) : 0

  return props.points.map((point, index) => {
    const safeValue = Math.max(point.value, 0)

    return {
      label: point.label,
      shortLabel: point.label.length > 8 ? point.label.slice(5) : point.label,
      x: 40 + step * index,
      y: 205 - (safeValue / max) * 165,
    }
  })
})

const polylinePoints = computed(() =>
  normalizedPoints.value.map((point) => `${point.x},${point.y}`).join(' ')
)

const areaPolygonPoints = computed(() => {
  if (normalizedPoints.value.length === 0) return ''

  const first = normalizedPoints.value[0]
  const last = normalizedPoints.value[normalizedPoints.value.length - 1]

  return [
    `${first.x},205`,
    ...normalizedPoints.value.map((point) => `${point.x},${point.y}`),
    `${last.x},205`,
  ].join(' ')
})

const labelPoints = computed(() => {
  if (normalizedPoints.value.length <= 6) return normalizedPoints.value

  const gap = Math.ceil(normalizedPoints.value.length / 6)
  return normalizedPoints.value.filter((_, index) => index % gap === 0)
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

.line-chart {
  width: 100%;
  height: 240px;
}

.grid-line {
  fill: none;
  stroke: var(--chart-grid);
  stroke-width: 1;
}

.axis {
  fill: none;
  stroke: var(--chart-axis);
  stroke-width: 1;
}

.area {
  fill: var(--chart-area);
  stroke: none;
}

.line {
  fill: none;
  stroke: var(--chart-line);
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.point {
  fill: var(--chart-point);
  stroke: #ffffff;
  stroke-width: 1.5;
}

.x-label {
  fill: var(--chart-label);
  font-size: 10px;
  text-anchor: middle;
}
</style>