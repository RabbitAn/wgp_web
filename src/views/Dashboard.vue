<script setup lang="ts">
import { NCard, NGrid, NGridItem, NStatistic, NSpace, NButton } from 'naive-ui'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <n-space vertical :size="24">
    <n-grid :cols="3" :x-gap="12" :y-gap="12">
      <n-grid-item>
        <n-card title="用户统计">
          <n-statistic label="总用户数" :value="123456" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="订单统计">
          <n-statistic label="总订单数" :value="23456" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="收入统计">
          <n-statistic label="总收入" :value="999999">
            <template #prefix>¥</template>
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-card title="操作面板">
      <div class="flex items-center gap-4">
        <p>计数器示例: {{ counterStore.count }}</p>
        <n-button @click="counterStore.increment">增加</n-button>
      </div>
    </n-card>
  </n-space>
</template>

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-4 {
  gap: 1rem;
}
</style>