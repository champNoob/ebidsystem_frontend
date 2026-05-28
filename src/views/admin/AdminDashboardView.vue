<template>
  <div class="dashboard-view">
    <div class="page-heading">
      <h2>管理员看板</h2>
      <button @click="loadDashboard" :disabled="loading">{{ loading ? '刷新中...' : '刷新数据' }}</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="moduleErrorItems.length > 0" class="warning-list">
      <div v-for="item in moduleErrorItems" :key="item" class="warning-item">
        {{ item }}
      </div>
    </div>

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
type DashboardModuleKey =
  | 'summary'
  | 'symbols'
  | 'orderStatus'
  | 'userRoles'
  | 'userRanking'
  | 'tradeTimeline'
const moduleErrors = ref<Partial<Record<DashboardModuleKey, string>>>({})
const moduleErrorItems = computed(() =>
  Object.values(moduleErrors.value).filter((item): item is string => Boolean(item)),
)

const summary = ref<AdminDashboardSummary | null>(null)
const symbolStats = ref<SymbolStat[]>([])
const orderStatusStats = ref<OrderStatusStat[]>([])
const userRoleStats = ref<UserRoleStat[]>([])
const userRanking = ref<UserRankingItem[]>([])
const tradeTimeline = ref<TradeTimelineItem[]>([])

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '待撮合',
  partial: '部分成交',
  filled: '已成交',
  cancelled: '已撤销',
}

const USER_ROLE_LABEL: Record<string, string> = {
  client: '普通客户',
  seller: '卖方用户',
  trader: '交易员',
  sales: '销售',
  admin: '管理员',
}

function completeItemsPreserveOrder(
  sourceItems: { label: string; value: number }[],
  requiredLabels: string[],
): { label: string; value: number }[] {
  const existed = new Set(sourceItems.map((item) => item.label))

  const missingItems = requiredLabels
    .filter((label) => !existed.has(label))
    .map((label) => ({
      label,
      value: 0,
    }))

  return [...sourceItems, ...missingItems]
}

function unwrapArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    for (const key of ['data', 'items', 'list', 'records', 'rows', 'result']) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[]
    }
  }
  return []
}

function toNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return 0
}

function toStringValue(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return '-'
}

function normalizeSummary(raw: unknown): AdminDashboardSummary {
  const obj = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
  return {
    total_orders: toNumber(obj.total_orders, obj.totalOrders, obj.orders),
    total_trades: toNumber(obj.total_trades, obj.totalTrades, obj.trades),
    total_volume: toNumber(obj.total_volume, obj.totalVolume, obj.volume),
    total_turnover: toNumber(obj.total_turnover, obj.totalTurnover, obj.turnover),
  }
}

function normalizeSymbolStats(raw: unknown): SymbolStat[] {
  return unwrapArray(raw).map((item) => {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {}
    return {
      symbol: toStringValue(obj.symbol, obj.stock_symbol),
      volume: toNumber(obj.volume, obj.total_volume, obj.totalVolume, obj.quantity, obj.total_quantity),
      turnover: toNumber(obj.turnover, obj.total_turnover, obj.totalTurnover, obj.amount),
    }
  }).filter((item) => item.symbol !== '-')
}

function normalizeOrderStatusStats(raw: unknown): OrderStatusStat[] {
  return unwrapArray(raw)
    .map((item) => {
      const obj = item && typeof item === 'object'
        ? item as Record<string, unknown>
        : {}

      return {
        status: toStringValue(obj.status, obj.order_status),
        count: toNumber(obj.count, obj.total, obj.value),
      }
    })
    .filter((item) => item.status !== '-')
}

function normalizeUserRoleStats(raw: unknown): UserRoleStat[] {
  const roleCounts: Record<string, number> = {
    client: 0,
    seller: 0,
    trader: 0,
    sales: 0,
    admin: 0,
  }

  for (const item of unwrapArray(raw)) {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {}
    const role = toStringValue(obj.role, obj.user_role)
    if (role !== '-') {
      roleCounts[role] = toNumber(obj.count, obj.total, obj.value)
    }
  }

  return Object.entries(roleCounts).map(([role, count]) => ({ role, count }))
}

function normalizeUserRanking(raw: unknown): UserRankingItem[] {
  return unwrapArray(raw).map((item) => {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {}
    return {
      user_id: toNumber(obj.user_id, obj.userID, obj.id) || undefined,
      username: toStringValue(obj.username, obj.user_name, obj.name),
      total_volume: toNumber(
        obj.total_volume,
        obj.totalVolume,
        obj.trade_volume,
        obj.volume,
        obj.total_quantity,
        obj.quantity,
      ),
    }
  }).filter((item) => item.username || item.user_id)
}

function normalizeTradeTimeline(raw: unknown): TradeTimelineItem[] {
  return unwrapArray(raw).map((item) => {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {}
    return {
      time_bucket: toStringValue(obj.time_bucket, obj.timeBucket, obj.bucket, obj.date, obj.time, obj.created_at),
      trades: toNumber(obj.trades, obj.trade_count, obj.count, obj.total_trades),
      volume: toNumber(obj.volume, obj.total_volume, obj.totalVolume, obj.total_quantity, obj.quantity),
      turnover: toNumber(obj.turnover, obj.total_turnover, obj.totalTurnover, obj.amount),
    }
  }).filter((item) => item.time_bucket !== '-')
}

const symbolVolumeItems = computed(() =>
  symbolStats.value.map((item) => ({ label: item.symbol, value: item.volume })),
)

const symbolTurnoverItems = computed(() =>
  symbolStats.value.map((item) => ({
    label: item.symbol,
    value: Number(item.turnover || 0),
  }))
)

const orderStatusItems = computed(() => {
  const sourceItems = orderStatusStats.value.map((item) => ({
    label: ORDER_STATUS_LABEL[item.status] || item.status,
    value: Number(item.count || 0),
  }))

  return completeItemsPreserveOrder(sourceItems, [
    '待撮合',
    '部分成交',
    '已成交',
    '已撤销',
  ])
})

const userRoleItems = computed(() => {
  const sourceItems = userRoleStats.value.map((item) => ({
    label: USER_ROLE_LABEL[item.role] || item.role,
    value: Number(item.count || 0),
  }))

  return completeItemsPreserveOrder(sourceItems, [
    '普通客户',
    '卖方用户',
    '交易员',
    '销售',
    '管理员',
  ])
})

const userRankingItems = computed(() =>
  userRanking.value.map((item) => ({
    label: item.username || `用户 ${item.user_id ?? '-'}`,
    value: item.total_volume,
  })),
)

const tradeVolumePoints = computed(() =>
  tradeTimeline.value.map((item) => ({ label: item.time_bucket, value: item.volume })),
)

async function loadDashboardPart(
  key: DashboardModuleKey,
  label: string,
  request: () => Promise<{ data: unknown }>,
  assign: (raw: unknown) => void,
) {
  try {
    const response = await request()
    assign(response.data)
  } catch (requestError) {
    moduleErrors.value = {
      ...moduleErrors.value,
      [key]: `${label}加载失败：${getApiErrorMessage(requestError, '接口请求失败')}`,
    }
  }
}
async function loadDashboard() {
  loading.value = true
  error.value = ''
  moduleErrors.value = {}

  try {
    await Promise.all([
      loadDashboardPart(
        'summary',
        '总览数据',
        getAdminDashboard,
        (raw) => {
          summary.value = normalizeSummary(raw)
        },
      ),

      loadDashboardPart(
        'symbols',
        'Symbol 成交统计',
        getSymbolStats,
        (raw) => {
          symbolStats.value = normalizeSymbolStats(raw)
        },
      ),

      loadDashboardPart(
        'orderStatus',
        '订单状态分布',
        getOrderStatusStats,
        (raw) => {
          orderStatusStats.value = normalizeOrderStatusStats(raw)
        },
      ),

      loadDashboardPart(
        'userRoles',
        '用户角色分布',
        getUserRoleStats,
        (raw) => {
          userRoleStats.value = normalizeUserRoleStats(raw)
        },
      ),

      loadDashboardPart(
        'userRanking',
        '用户交易排行',
        getUserRanking,
        (raw) => {
          userRanking.value = normalizeUserRanking(raw)
        },
      ),

      loadDashboardPart(
        'tradeTimeline',
        '成交趋势',
        getTradeTimeline,
        (raw) => {
          tradeTimeline.value = normalizeTradeTimeline(raw)
        },
      ),
    ])
  } catch (unexpectedError) {
    error.value = getApiErrorMessage(unexpectedError, '加载管理员看板时发生未知错误')
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

h2 {
  margin: 0;
  color: #0f172a;
}

p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
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

.warning-list {
  display: grid;
  gap: 8px;
}

.warning-item {
  padding: 10px 12px;
  border: 1px solid #fde68a;
  border-radius: 10px;
  background: #fffbeb;
  color: #92400e;
  font-size: 13px;
}
</style>
