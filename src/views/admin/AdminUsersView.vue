<template>
  <div class="admin-users-view">
    <section class="panel">
      <h2>用户管理</h2>
      <p>当前后端已实现：按用户 ID 查询、创建用户。</p>

      <div class="query-row">
        <input v-model.number="queryUserId" type="number" min="1" placeholder="输入用户 ID" />
        <button @click="queryUser" :disabled="queryLoading || !queryUserId">
          {{ queryLoading ? '查询中...' : '查询用户' }}
        </button>
      </div>

      <div v-if="queryError" class="error">{{ queryError }}</div>

      <div v-if="queriedUser" class="user-card">
        <div><span>ID</span><strong>{{ queriedUser.id }}</strong></div>
        <div><span>用户名</span><strong>{{ queriedUser.username }}</strong></div>
        <div><span>角色</span><strong>{{ queriedUser.role }}</strong></div>
        <div><span>状态</span><strong>{{ userStatusText }}</strong></div>
      </div>

      <div class="todo-actions">
        <button disabled>用户列表（后端接口待实现）</button>
        <button disabled>修改角色（后端接口待实现）</button>
        <button disabled>禁用用户（后端接口待实现）</button>
      </div>
    </section>

    <section class="panel">
      <h2>创建用户</h2>
      <form class="create-form" @submit.prevent="submitCreateUser">
        <div class="form-item">
          <label>用户名</label>
          <input v-model.trim="createForm.username" required />
        </div>

        <div class="form-item">
          <label>密码</label>
          <input v-model="createForm.password" type="password" required />
        </div>

        <div class="form-item">
          <label>角色</label>
          <select v-model="createForm.role" required>
            <option value="client">client</option>
            <option value="seller">seller</option>
            <option value="trader">trader</option>
            <option value="sales">sales</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <div v-if="createMessage" :class="{ error: createIsError, success: !createIsError }">
          {{ createMessage }}
        </div>

        <button type="submit" :disabled="createLoading">
          {{ createLoading ? '创建中...' : '创建用户' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getApiErrorMessage } from '@/api/axios'
import { createAdminUser, getAdminUserById } from '@/api/admin'
import type { AdminUser } from '@/types/admin'
import type { UserRole } from '@/types/auth'

const route = useRoute()

const queryUserId = ref<number | null>(null)
const queryLoading = ref(false)
const queryError = ref('')
const queriedUser = ref<AdminUser | null>(null)

const createLoading = ref(false)
const createMessage = ref('')
const createIsError = ref(false)
const createForm = reactive({
  username: '',
  password: '',
  role: 'client' as UserRole,
})

const userStatusText = computed(() => {
  if (!queriedUser.value) return '-'
  if (queriedUser.value.status) return queriedUser.value.status
  return queriedUser.value.is_deleted ? 'disabled' : 'active'
})

async function queryUser() {
  if (!queryUserId.value) return

  queryLoading.value = true
  queryError.value = ''
  queriedUser.value = null

  try {
    const response = await getAdminUserById(queryUserId.value)
    queriedUser.value = response.data
  } catch (requestError) {
    queryError.value = getApiErrorMessage(requestError, '查询用户失败')
  } finally {
    queryLoading.value = false
  }
}

async function submitCreateUser() {
  createLoading.value = true
  createMessage.value = ''
  createIsError.value = false

  try {
    const response = await createAdminUser({
      username: createForm.username,
      password: createForm.password,
      role: createForm.role,
    })

    createMessage.value = response.data.message || '用户创建成功'
    createForm.username = ''
    createForm.password = ''
    createForm.role = 'client'
  } catch (requestError) {
    createMessage.value = getApiErrorMessage(requestError, '创建用户失败')
    createIsError.value = true
  } finally {
    createLoading.value = false
  }
}

onMounted(() => {
  const routeId = Number(route.params.id)
  if (Number.isInteger(routeId) && routeId > 0) {
    queryUserId.value = routeId
    queryUser()
  }
})
</script>

<style scoped>
.admin-users-view {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.8fr);
  gap: 18px;
}

.panel {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

h2 {
  margin: 0 0 8px;
  color: #0f172a;
}

p {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
}

.query-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

button {
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
}

button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.user-card {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.user-card div {
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
}

.user-card span {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
}

.user-card strong {
  color: #0f172a;
}

.todo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.create-form {
  display: grid;
  gap: 14px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 14px;
}

.error,
.success {
  font-size: 14px;
}

.error {
  color: #dc2626;
}

.success {
  color: #16a34a;
}
</style>
