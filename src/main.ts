import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from '@/composables/useAuth'

const app = createApp(App)

app.use(router)

const { token, fetchMe } = useAuth()
if (token.value) {
  fetchMe().catch(() => {
    // token 失效，静默失败即可（不 await，避免阻塞首屏）
  })
}

app.mount('#app')
