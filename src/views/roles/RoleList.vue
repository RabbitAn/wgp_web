<script setup lang="ts">
import { 
  NCard, 
  NDataTable, 
  NButton, 
  NTag,
  NPopconfirm,
  NInput,
  NForm,
  NFormItem,
  NSpace,
  NModal,
  useMessage,
  NPagination
} from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import { ref, h, onMounted, reactive, computed } from 'vue'
import { getRoleList, deleteRole, createRole, updateRole, type RoleListResponse } from '@/api/role'

// 定义角色数据类型（与API响应匹配）
interface Role {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

// 角色数据
const roles = ref<Role[]>([])

// 加载状态
const loading = ref(false)

// 路由
const router = useRouter()

// 消息提示
const message = useMessage()

// 分页相关状态
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0
})

// 搜索表单
const searchForm = ref({
  role_name: ''
})

// 模态框相关状态
const showModal = ref(false)
const isEditing = ref(false)
const currentRoleId = ref<number | null>(null)

// 角色表单数据
const roleForm = reactive({
  name: '',
  description: ''
})

// 表单验证规则
const formRules = {
  name: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  }
}

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(pagination.itemCount / pagination.pageSize)
})

// 获取角色列表
const loadRoles = async () => {
  loading.value = true
  try {
    const response = await getRoleList({
      role_name: searchForm.value.role_name || undefined,
      page: pagination.page,
      page_size: pagination.pageSize
    })    
    
    // 根据实际响应结构处理数据
    let roleListData: Role[] = []
    // 现在API返回的是RoleListResponse对象，而不是数组
    if (response.data && response.data.roles && Array.isArray(response.data.roles)) {
      response.data.roles.forEach((role: any) => {
        roleListData.push({
          id: role.id,
          name: role.name,
          description: role.description,          
          created_at: role.created_at,
          updated_at: role.updated_at
        })
      })
    }
    
    roles.value = roleListData.map(role => ({
      ...role,
      // 时间转换成日期字符串
      created_at: new Date(role.created_at).toLocaleString(),
      updated_at: new Date(role.updated_at).toLocaleString()

    })) 
    pagination.itemCount = response.data.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
    message.error('获取角色列表失败: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadRoles()
}

// 处理页面大小变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1 // 重置到第一页
  loadRoles()
}

// 删除角色
const handleDeleteRole = async (id: number) => {
  try {
    await deleteRole(id)
    message.success('角色删除成功')
    // 删除成功后重新加载角色列表
    await loadRoles()
  } catch (error) {
    console.error('删除角色失败:', error)
    message.error('删除角色失败: ' + (error as Error).message)
  }
}

// 编辑角色
const handleEditRole = (id: number) => {
  router.push({
    name: 'RoleDetail', // 修正路由名称
    params: { id }
  })
}

// 打开新增角色模态框
const openAddRoleModal = () => {
  isEditing.value = false
  currentRoleId.value = null
  // 重置表单
  roleForm.name = ''
  roleForm.description = ''
  showModal.value = true
}

// 打开编辑角色模态框
const openEditRoleModal = (role: Role) => {
  isEditing.value = true
  currentRoleId.value = role.id
  // 填充表单数据
  roleForm.name = role.name
  roleForm.description = role.description
  showModal.value = true
}

// 提交角色表单
const handleSubmitRole = async () => {
  try {
    if (isEditing.value && currentRoleId.value) {
      // 编辑角色
      await updateRole(currentRoleId.value, {
        name: roleForm.name,
        description: roleForm.description
      })
      message.success('角色更新成功')
    } else {
      // 新增角色（注意：API中创建角色的接口只接受name字段）
      await createRole({
        name: roleForm.name
      })
      message.success('角色创建成功')
    }
    
    // 关闭模态框
    showModal.value = false
    
    // 重新加载角色列表
    await loadRoles()
  } catch (error: any) {
    console.error('操作失败:', error)
    message.error(isEditing.value ? '角色更新失败: ' + (error.message || '') : '角色创建失败: ' + (error.message || ''))
  }
}

// 搜索角色
const handleSearch = () => {
  pagination.page = 1 // 搜索时重置到第一页
  loadRoles()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    role_name: ''
  }
  pagination.page = 1 // 重置时重置到第一页
  loadRoles()
}

// 组件挂载时加载数据
onMounted(() => {
  loadRoles()
})

// 表格列定义
const columns = [
  {
    title: '序号',
    key: 'index',
    render(row: Role, index: number) {
      // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
      return (pagination.page - 1) * pagination.pageSize + index + 1
    }
  },
  {
    title: '描述',
    key: 'description'
  },
  {
    title: '创建时间',
    key: 'created_at'
  },
  {
    title: '更新时间',
    key: 'updated_at'
  },
  {
    title: '操作',
    key: 'actions',
    render(row: Role) {
      return h('div', [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => openEditRoleModal(row)
          },
          { default: () => '编辑' }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDeleteRole(row.id),
            negativeText: '取消',
            positiveText: '确认'
          },
          {
            trigger: () => h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: 'margin-left: 10px'
              },
              { default: () => '删除' }
            ),
            default: () => '确认删除该角色吗？'
          }
        )
      ])
    }
  }
]
</script>

<template>
  <n-card title="角色列表">
    <!-- 搜索表单 -->
    <n-form :model="searchForm" label-placement="left" label-width="80" inline>
      <n-form-item label="角色名称">
        <n-input v-model:value="searchForm.role_name" placeholder="请输入角色名称" />
      </n-form-item>
      <n-form-item>
        <n-space>
          <n-button type="primary" @click="handleSearch">搜索</n-button>
          <n-button @click="handleReset">重置</n-button>
          <n-button type="primary" @click="openAddRoleModal">新增角色</n-button>
        </n-space>
      </n-form-item>
    </n-form>
    
    <!-- 角色表格 -->
    <n-data-table :columns="columns" :data="roles" :bordered="false" :loading="loading" />
    
    <!-- 分页 -->
    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <n-pagination 
        v-model:page="pagination.page" 
        v-model:page-size="pagination.pageSize"
        :item-count="pagination.itemCount"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
    
    <!-- 角色模态框 -->
    <n-modal v-model:show="showModal" preset="card" :style="{ width: '500px' }" title="角色信息">
      <n-form :model="roleForm" :rules="formRules" label-placement="left" label-width="80">
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="roleForm.name" placeholder="请输入角色名称" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="roleForm.description" placeholder="请输入描述" type="textarea" />
        </n-form-item>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmitRole">确认</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </n-card>
</template>

<style scoped>
/* 可以添加一些自定义样式 */
</style>