<template>
  <div class="orders-container">
    <h2>订单列表</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="orders.length === 0">暂无订单</div>
      <div v-else>
        <div v-for="order in orders" :key="order.id" class="order-item">
          <h3>订单 #{{ order.id }}</h3>
          <p>状态: {{ order.status }}</p>
          <p>金额: ￥{{ order.amount }}</p>
          <p>创建时间: {{ formatDate(order.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

interface Order {
  id: number;
  status: string;
  amount: string;
  createdAt: Date;
}

export default defineComponent({
  name: 'OrdersView',
  setup() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const orders = ref<Order[]>([]);
    const loading = ref(true);
    const error = ref('');

    onMounted(async () => {
      if (!isAuthenticated.value) {
        router.push('/login');
        return;
      }
      
      try {
        // 这里可以添加获取订单数据的API调用
        // const response = await fetchOrders();
        // orders.value = response.data;
        
        // 模拟数据
        orders.value = [
          { id: 1, status: '已完成', amount: '100.00', createdAt: new Date() },
          { id: 2, status: '处理中', amount: '200.00', createdAt: new Date() },
        ];
      } catch (err) {
        error.value = '加载订单失败';
        console.error('获取订单失败:', err);
      } finally {
        loading.value = false;
      }
    });

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString();
    };

    return {
      orders,
      loading,
      error,
      formatDate,
    };
  },
});
</script>

<style scoped>
.orders-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.order-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-item h3 {
  margin-top: 0;
  color: #333;
}

.order-item p {
  margin: 5px 0;
  color: #666;
}
</style>