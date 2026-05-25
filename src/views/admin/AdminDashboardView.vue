<template>
  <div class="dashboard-view">
    <div class="page-heading">
      <h2>管理员看板</h2>
      <button @click="loadDashboard" :disabled="loading">{{ loading ? '刷新中...' : '刷新数据' }}</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <section class="stat-grid">
      <StatCard title="订单总数" :value="summary?.total_orders ?? 0" />
      <StatCard title="成交总数" :value="summary?.total_trades ?? 0" />
      <StatCard title="成交总量" :value="summary?.total_volume ?? 0" />
      <StatCard title="成交额" :value="summary?.total_turnover ?? 0" />
    </section>

    <section class="chart-grid">
      <BarChart title="Symbol 成交量" :items="symbolVolumeItems" />
      <PieChart title="Symbol 成交额占比" :items="symbolTurnoverItems" />
      <PieChart title="订单状态分布" :items="orderStatusItems" />
      <PieChart title="用户角色分布" :items="userRoleItems" />
      <BarChart title="用户交易排行" :items="userRankingItems" />
      <LineChart title="成交趋势（按成交量）" :points="tradeVolumePoints" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getApiErrorMessage } from '@/api/axios'
import {
  getAdminDashboard,
  getOrderStatusStats,
  getSymbolStats,
  getTradeTimeline,
  getUserRanking,
  getUserRoleStats,
} from '@/api/admin'
import StatCard from '@/components/common/StatCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import type {
  AdminDashboardSummary,
  OrderStatusStat,
  SymbolStat,
  TradeTimelineItem,
  UserRankingItem,
  UserRoleStat,
} from '@/types/admin'

const loading = ref(false)
const error = ref('')
const summary = ref<AdminDashboardSummary | null>(null)
const symbolStats = ref<SymbolStat[]>([])
const orderStatusStats = ref<OrderStatusStat[]>([])
const userRoleStats = ref<UserRoleStat[]>([])
const userRanking = ref<UserRankingItem[]>([])
const tradeTimeline = ref<TradeTimelineItem[]>([])

const symbolVolumeItems = computed(() =>
  symbolStats.value.map((item) => ({ label: item.symbol, value: item.volume })),
)

const symbolTurnoverItems = computed(() =>
  symbolStats.value.map((item) => ({ label: item.symbol, value: item.turnover })),
)

const orderStatusItems = computed(() =>
  orderStatusStats.value.map((item) => ({ label: String(item.status), value: item.count })),
)

const userRoleItems = computed(() =>
  userRoleStats.value.map((item) => ({ label: String(item.role), value: item.count })),
)

const userRankingItems = computed(() =>
  userRanking.value.map((item) => ({
    label: item.username || `用户 ${item.user_id ?? '-'}`,
    value: item.total_volume,
  })),
)

const tradeVolumePoints = computed(() =>
  tradeTimeline.value.map((item) => ({ label: item.time_bucket, value: item.volume })),
)

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [summaryRes, symbolRes, orderStatusRes, userRoleRes, rankingRes, timelineRes] = await Promise.all([
      getAdminDashboard(),
      getSymbolStats(),
      getOrderStatusStats(),
      getUserRoleStats(),
      getUserRanking(),
      getTradeTimeline(),
    ])

    summary.value = summaryRes.data
    symbolStats.value = symbolRes.data
    orderStatusStats.value = orderStatusRes.data
    userRoleStats.value = userRoleRes.data
    userRanking.value = rankingRes.data
    tradeTimeline.value = timelineRes.data
  } catch (requestError) {
    error.value = getApiErrorMessage(requestError, '获取管理员看板数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.dashboard-view {
  display: grid;
  gap: 20px;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  margin: 0;
  color: #0f172a;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.error {
  padding: 12px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #dc2626;
}
</style>
