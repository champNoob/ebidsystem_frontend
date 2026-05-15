# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## 项目结构

```txt
ebidsystem_frontend/
├── docs/                       # 文档
│   ├── architecture/             # 架构设计文档
│   ├── note/                     # 常规笔记
│   └── notes_of_every_stage/    # 各阶段开发笔记
|
├── node_modules/               # 依赖包
|
├── public/                     # 静态资源
│
├── src/                        # 前端源码
│   ├── api/                      # API 请求
│   │   ├── auth.api.ts             # 认证相关API
│   │   ├── axios.ts                # Axios配置
│   │   ├── order.api.ts            # 订单相关API
│   │   └── user.api.ts             # 用户相关API
│   ├── assets/                   # 静态资源
│   |   └── vue.svg                 # Vue图标
│   |
│   ├── components/               # 组件
│   |
|   ├── composables/              # 组合式函数
|   |   ├── useAuth.ts              # 认证相关函数
|   |   └── useOrder.ts             # 订单相关函数
|   |
|   ├── config/                   # 配置
|   |   └── orderRules.config.ts    # 订单规则配置
|   |
|   ├── layouts/                  # 布局
|   |   ├── EmptyLayout.vue         # 空布局
|   |   └── MainLayout.vue          # 主布局
|   |
|   ├── router/                   # 路由
|   |   └── index.ts                # 路由配置
|   |
|   ├── types/                    # 类型定义
|   |   ├── auth.ts                 # 认证类型
|   |   └── order.ts                # 订单类型
|   |
|   ├── utils/                    # 工具函数
|   |   └── storage.ts              # 存储工具
|   |
│   ├── views/                    # 页面
|   |   ├── LoginView.vue           # 登录页面
|   |   ├── MyAccountView.vue       # 我的账户页面
|   |   ├── OrdersView.vue          # 订单页面
|   |   ├── PlaceOrderView.vue      # 下单页面
|   |   ├── RegisterView.vue        # 注册页面
|   |   └── TradesView.vue          # 交易页面
|   └── App.vue                   # 根组件
|
├── .gitattributes              # Git属性配置
├── .gitignore                  # Git忽略文件
├── index.html                  # 入口HTML
├── package-lock.json           # npm包锁定文件
├── package.json                # 项目依赖配置
├── README.md                   # 项目说明
├── tsconfig.app.json           # TypeScript应用配置
├── tsconfig.json               # TypeScript配置
├── tsconfig.node.json          # TypeScript节点配置
└── vite.config.ts              # Vite配置
```