# 编码阶段

##

## 2：Axios 封装 + JWT 自动注入

预先绑定了 `baseURL` / `timeout` / `interceptors` 的 axios 实例

### ✅ 正确操作

1. **集中封装 Axios**
2. 自动注入 `Authorization: Bearer <token>`
3. 不在每个请求里手写 token

```ts
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### 🎯 设计理念

* 前端请求层 = 基础设施（Infrastructure）
* 业务代码不应该关心“token 从哪来”

这是**前端分层意识**的体现。

### ⚠️ 坑点

* CORS 问题（你已解决，且定位正确）
* 不要在组件里直接拼 Authorization 头

## 3：useAuth composable（前端状态边界的第一次建立）

### ✅ 正确操作

引入了 `useAuth`，并且：

* token 是全局唯一状态
* 登录后保存 token
* 后续通过 `/api/me` 拉取用户信息

```ts
const token = ref<string | null>(...)
const user = ref<User | null>(null)
```

### 🎯 设计理念

这是**不使用 Pinia 但依然“有状态模型”**的典范做法：

* composable = 轻量级 domain store
* 比 Vuex/Pinia 更贴合你当前规模

### ⚠️ 坑点

* 忘记做「登录态恢复」（你已意识到）
* user 和 token 生命周期不一致（你已修正）

## 4：路由与 Layout 分离（关键转折点）

这是你**真正从“写页面”迈入“架构设计”**的时刻。

### ✅ 正确操作

你最终接受并实现了：

* Public Area（登录）
* Protected Area（业务）
* **Layout 分离**

```text
EmptyLayout   → /login
MainLayout    → /orders /place-order /me
```

### 🎯 设计理念

这是所有中大型系统的**标准结构**：

* 登录页 ≠ 系统外壳
* 业务页共享导航与框架
* 路由负责“区域切换”，不是组件自己判断

### ⚠️ 坑点（你已经踩过并理解了）

* 把导航写在 App.vue → 导致登录页“泄露”
* 用 v-if 控制显示 → 不如结构上隔离

## 5：下单页实现（你开始体现“金融系统意识”）

### ✅ 正确操作

你的下单页做到了：

* 表单字段完整
* 不判断成交结果
* 完全信任后端返回
* 错误原样展示

这是**正确的交易前端行为**。

### 🎯 更高级的一步（你后来意识到的）

#### 角色 × 买卖方向限制

你主动提出：

> 前端是否应该限制角色可选的买卖方向？

这是一个**非常成熟的问题**。

#### 你的最终做法是正确的：

* 后端：强校验
* 前端：UI 限制 + 防呆
* 规则集中定义（而不是散落）

```ts
ROLE_ALLOWED_SIDES = {
  client: ['BUY'],
  seller: ['SELL'],
  trader: ['BUY', 'SELL'],
}
```

### ⚠️ 坑点

* 不要把它当成“权限控制”
* 不要写死在模板里

## 6：当前订单页（状态驱动 UI）

### ✅ 正确操作

你的 OrdersView：

* 完全以 `status` 驱动 UI
* pending / partial → 显示撤单
* filled / cancelled → 禁用

```vue
v-if="order.status === 'pending' || order.status === 'partial'"
```

### 🎯 设计理念

这是**事件溯源 + 状态机思维**在前端的体现：

* 前端不“推测状态”
* 前端只“响应状态”

### ⚠️ 坑点

* 不要在前端维护“订单生命周期”
* 不要假设 partial 一定还能撤单（以接口返回为准）

### 接下来“合理且不激进”的前进方向

在“不引入过多新插件”的前提下，我建议优先级是：

- 顶部用户信息区（username + role）：强化系统感、可信度、演示效果

- 当前订单 vs 历史订单（仅前端区分）：不改后端，也能体现业务深度

- 表单 / 表格 UI 微优化：spacing、hover、disabled 状态
