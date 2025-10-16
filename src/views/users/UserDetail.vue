<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NDescriptions, NDescriptionsItem, NSpace, NButton, NAvatar, NMessageProvider, useMessage } from 'naive-ui'
import { getUserDetail, type UserInfo } from '@/api/user'


// 获取路由参数
const route = useRoute()
const router = useRouter()
const message = useMessage()

// 用户详情数据
const userDetails = ref<UserInfo>({
  id: '',
  username: '',
  email: '',
  phone: '',
  role: '',
  is_active: false,
  created_at: '',
  updated_at: ''
})

// 加载状态
const loading = ref(false)

// 获取用户详情
const loadUserDetails = async () => {
  loading.value = true
  try {
    const userId = route.params.id as string
    if (!userId) {
      message.error('无效的用户ID')
      return
    }
    
    const response = await getUserDetail(userId)
    userDetails.value = response.data
  } catch (error) {
    console.error('获取用户详情失败:', error)
    message.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

// 返回用户列表
const handleBack = () => {
  router.push({ name: 'Users' })
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserDetails()
})
</script>

<template>
  <n-message-provider>
    <n-card title="用户详情" :loading="loading">
      <n-space vertical>
        <div class="flex items-center gap-4">
          <n-avatar :size="64" round :src="undefined">
            {{ userDetails.username.charAt(0).toUpperCase() }}
          </n-avatar>
          <div>
            <h3 class="text-xl font-bold">{{ userDetails.username }}</h3>
          </div>
        </div>
        
        <n-descriptions label-placement="left" bordered :column="1">
          <n-descriptions-item label="角色">
            {{ userDetails.role }}
          </n-descriptions-item>
        </n-descriptions>
        
        <n-space>
          <n-button type="primary">编辑</n-button>
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