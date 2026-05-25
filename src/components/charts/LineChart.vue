<template>
  <div class="chart-card">
    <h3>{{ title }}</h3>
    <div v-if="points.length === 0" class="empty">暂无数据</div>
    <svg v-else class="line-chart" viewBox="0 0 600 240" role="img">
      <polyline class="grid-line" points="40,40 580,40" />
      <polyline class="grid-line" points="40,120 580,120" />
      <polyline class="grid-line" points="40,200 580,200" />
      <polyline class="axis" points="40,20 40,205 580,205" />
      <polyline class="line" :points="polylinePoints" />
      <circle v-for="point in normalizedPoints" :key="point.label" class="point" :cx="point.x" :cy="point.y" r="4" />
      <text v-for="point in labelPoints" :key="point.label + '-label'" class="x-label" :x="point.x" y="230">
        {{ point.shortLabel }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartPoint {
  label: string
  value: number
}

const props = defineProps<{
  title: string
  points: ChartPoint[]
}>()

const normalizedPoints = computed(() => {
  const max = Math.max(...props.points.map((point) => point.value), 1)
  const step = props.points.length > 1 ? 540 / (props.points.length - 1) : 0

  return props.points.map((point, index) => ({
    label: point.label,
    shortLabel: point.label.slice(5),
    x: 40 + step * index,
    y: 205 - (point.value / max) * 165,
  }))
})

const polylinePoints = computed(() => normalizedPoints.value.map((point) => `${point.x},${point.y}`).join(' '))

const labelPoints = computed(() => {
  if (normalizedPoints.value.length <= 6) return normalizedPoints.value
  return normalizedPoints.value.filter((_, index) => index % Math.ceil(normalizedPoints.value.length / 6) === 0)
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

.line-chart {
  width: 100%;
  height: 240px;
}

.grid-line {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 1;
}

.axis {
  fill: none;
  stroke: #94a3b8;
  stroke-width: 1;
}

.line {
  fill: none;
  stroke: #2563eb;
  stroke-width: 3;
}

.point {
  fill: #2563eb;
}

.x-label {
  fill: #64748b;
  font-size: 10px;
  text-anchor: middle;
}
</style>
