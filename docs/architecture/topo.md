# 项目结构

```txt
ebidsystem_frontend
├─ index.html
├─ package.json
├─ vite.config.ts
├─ .gitignore

├─ src
│  ├─ main.ts                 # 应用入口
│  ├─ App.vue                 # 根组件（只放 Layout / RouterView）
│
│  ├─ api/                    # 所有 HTTP 请求（唯一入口）
│  │  ├─ axios.ts             # Axios 实例 + 拦截器
│  │  ├─ auth.api.ts          # 登录 / 注册
│  │  └─ order.api.ts         # 下单 / 撤单 / 查询订单
│
│  ├─ composables/            # 业务无关的状态组合
│  │  ├─ useAuth.ts           # JWT 管理
│  │  └─ useOrders.ts         # 订单数据获取
│
│  ├─ views/                  # 页面（路由级）
│  │  ├─ LoginView.vue
│  │  ├─ PlaceOrderView.vue
│  │  ├─ OrdersView.vue
│  │  └─ TradesView.vue       # 可选
│
│  ├─ router/
│  │  └─ index.ts
│
│  ├─ types/                  # 后端数据结构映射
│  │  ├─ auth.ts
│  │  └─ order.ts
│
│  └─ utils/
│     └─ storage.ts           # localStorage 封装
│
└─ tsconfig.json
```
