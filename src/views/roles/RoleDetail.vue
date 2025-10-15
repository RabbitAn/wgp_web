<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NDescriptions, NDescriptionsItem, NSpace, NButton, NAvatar, NMessageProvider, useMessage, NTag } from 'naive-ui'
import { getRoleDetail } from '@/api/role'
import type { RoleInfo } from '@/api/role'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const message = useMessage()

// 角色详情数据
const roleDetails = ref<RoleInfo>({
  id: 0,
  name: '',
  description: '',
  created_at: '',
  updated_at: ''
})

// 加载状态
const loading = ref(false)

// 获取角色详情
const loadRoleDetails = async () => {
  loading.value = true
  try {
    const roleId = route.params.id as string
    if (!roleId) {
      message.error('无效的角色ID')
      return
    }
    
    const response = await getRoleDetail(roleId)
    roleDetails.value = response.data
  } catch (error) {
    console.error('获取角色详情失败:', error)
    message.error('获取角色详情失败')
  } finally {
    loading.value = false
  }
}

// 返回角色列表
const handleBack = () => {
  router.push({ name: 'roles' })
}

// 编辑角色
const handleEdit = () => {
  router.push({ name: 'roles' })
}

// 组件挂载时加载数据
onMounted(() => {
  loadRoleDetails()
})
</script>

<template>
  <n-message-provider>
    <n-card title="角色详情" :loading="loading">
      <n-space vertical>
        <div class="flex items-center gap-4">
          <n-avatar :size="64" round :src="undefined">
            {{ roleDetails.name.charAt(0).toUpperCase() }}
          </n-avatar>
          <div>
            <h3 class="text-xl font-bold">{{ roleDetails.name }}</h3>
            <p class="text-gray-500">{{ roleDetails.description }}</p>
          </div>
        </div>
        
        <n-descriptions label-placement="left" bordered :column="1">
          <n-descriptions-item label="角色ID">
            {{ roleDetails.id }}
          </n-descriptions-item>
          <n-descriptions-item label="角色名称" >
            {{ roleDetails.name }}
          </n-descriptions-item>
          <n-descriptions-item label="描述">
            {{ roleDetails.description }}
          </n-descriptions-item>
          <n-descriptions-item label="创建时间">
            {{ roleDetails.created_at }}
          </n-descriptions-item>
          <n-descriptions-item label="更新时间">
            {{ roleDetails.updated_at }}
          </n-descriptions-item>
        </n-descriptions>
        
        <n-space>
          <n-button type="primary" @click="handleEdit">编辑</n-button>
          <n-button @click="handleBack">返回</n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-message-provider>
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

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.font-bold {
  font-weight: 700;
}

.text-gray-500 {
  color: #6b7280;
}
</style>