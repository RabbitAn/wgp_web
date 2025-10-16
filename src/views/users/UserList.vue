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
  NSelect,
  useMessage,
  NPagination,
  NSwitch
} from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import { ref, h, onMounted, reactive, computed } from 'vue'
import { getUserList, deleteUser, createUser, updateUser, type UserListResponse } from '@/api/user'

// 定义用户数据类型（与API响应匹配）
interface User {
  id: number
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  is_active: boolean,
  created_at: string,
  updated_at: string
}

// 用户数据
const users = ref<User[]>([])

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
  username: '',
  email: '',
  role: ''
})

// 模态框相关状态
const showModal = ref(false)
const isEditing = ref(false)
const currentUserId = ref<number | null>(null)

// 用户表单数据
const userForm = reactive({
  username: '',
  email: '',
  role: '',
  password: '',
  is_active: true
})

// 表单验证规则
const formRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  role: {
    required: true,
    message: '请选择角色',
    trigger: 'change'
  }
}

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '工程师', value: 'engineer' },
  { label: '普通用户', value: 'operator' }
]

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(pagination.itemCount / pagination.pageSize)
})

// 获取用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await getUserList({
      username: searchForm.value.username || undefined,
      email: searchForm.value.email || undefined,
      role: searchForm.value.role || undefined,
      page: pagination.page,
      page_size: pagination.pageSize
    })    
    
    // 根据实际响应结构处理数据
    let userListData: User[] = []
    // 现在API返回的是UserListResponse对象，而不是数组
    if (response.data && response.data.users && Array.isArray(response.data.users)) {
      response.data.users.forEach((user: any) => {
        userListData.push({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.is_active ? 'active' : 'inactive',
          is_active: user.is_active,
          created_at: user.created_at || '',
          updated_at: user.updated_at || ''
        })
      })
    }
    
    users.value = userListData.map(user => {
      return {
        ...user,
       //时间转换
       created_at: user.created_at ? new Date(user.created_at).toLocaleString() : '',
       updated_at: user.updated_at ? new Date(user.updated_at).toLocaleString() : ''
      }
    })
    pagination.itemCount = response.data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
    message.error('获取用户列表失败: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadUsers()
}

// 处理页面大小变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1 // 重置到第一页
  loadUsers()
}

// 删除用户
const handleDeleteUser = async (id: number) => {
  try {
    await deleteUser(id)
    message.success('用户删除成功')
    // 删除成功后重新加载用户列表
    await loadUsers()
  } catch (error) {
    console.error('删除用户失败:', error)
    message.error('删除用户失败: ' + (error as Error).message)
  }
}

// 编辑用户
const handleEditUser = (id: number) => {
  router.push({
    name: 'UserDetail', // 修正路由名称
    params: { id }
  })
}

// 打开新增用户模态框
const openAddUserModal = () => {
  isEditing.value = false
  currentUserId.value = null
  // 重置表单
  userForm.username = ''
  userForm.email = ''
  userForm.role = ''
  userForm.password = ''
  userForm.is_active = true
  showModal.value = true
}

// 打开编辑用户模态框
const openEditUserModal = (user: User) => {
  isEditing.value = true
  currentUserId.value = user.id
  // 填充表单数据
  userForm.username = user.username
  userForm.email = user.email
  userForm.role = user.role
  userForm.password = '' // 编辑时密码字段留空
  userForm.is_active = user.is_active
  showModal.value = true
}

// 提交用户表单
const handleSubmitUser = async () => {
  try {
    if (isEditing.value && currentUserId.value) {
      // 编辑用户
      const updateData: any = {
        username: userForm.username,
        email: userForm.email,
        role: userForm.role,
        is_active: userForm.is_active
      }
      
      // 只有在输入密码时才更新
      if (userForm.password) {
        updateData.password = userForm.password
      }
      
      await updateUser(currentUserId.value, updateData)
      message.success('用户更新成功')
    } else {
      // 新增用户
      if (!userForm.password) {
        message.error('请输入密码')
        return
      }
      
      await createUser({
        username: userForm.username,
        email: userForm.email,
        role: userForm.role,
        password: userForm.password,
        is_active: userForm.is_active
      })
      message.success('用户创建成功')
    }
    
    // 关闭模态框
    showModal.value = false
    
    // 重新加载用户列表
    await loadUsers()
  } catch (error: any) {
    console.error('操作失败:', error)
    message.error(isEditing.value ? '用户更新失败: ' + (error.message || '') : '用户创建失败: ' + (error.message || ''))
  }
}

// 搜索用户
const handleSearch = () => {
  pagination.page = 1 // 搜索时重置到第一页
  loadUsers()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    username: '',
    email: '',
    role: ''
  }
  pagination.page = 1 // 重置时重置到第一页
  loadUsers()
}

// 组件挂载时加载数据
onMounted(() => {
  loadUsers()
})

// 表格列定义
const columns = [
  {
    title: '序号',
    key: 'index',
    render(row: User, index: number) {
      // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
      return (pagination.page - 1) * pagination.pageSize + index + 1
    }
  },
  {
    title: '姓名',
    key: 'username'
  },

  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '角色',
    key: 'role'
  },
  
  {
    title: '状态',
    key: 'status',
    render(row: User) {
      return h(
        NTag,
        {
          type: row.status === 'active' ? 'success' : 'error'
        },
        {
          default: () => (row.status === 'active' ? '激活' : '未激活')
        }
      )
    }
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
    render(row: User) {
      return h('div', [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => openEditUserModal(row)
          },
          { default: () => '编辑' }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDeleteUser(row.id),
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
            default: () => '确认删除该用户吗？'
          }
        )
      ])
    }
  }
]
</script>

<template>
  <n-card title="用户列表">
    <!-- 搜索表单 -->
    <n-form :model="searchForm" label-placement="left" label-width="80" inline>
      <n-form-item label="姓名">
        <n-input v-model:value="searchForm.username" placeholder="请输入姓名" />
      </n-form-item>
      <n-form-item label="邮箱">
        <n-input v-model:value="searchForm.email" placeholder="请输入邮箱" />
      </n-form-item>
      <n-form-item label="角色">
        <n-input v-model:value="searchForm.role" placeholder="请输入角色" />
      </n-form-item>
      <n-form-item>
        <n-space>
          <n-button type="primary" @click="handleSearch">搜索</n-button>
          <n-button @click="handleReset">重置</n-button>
          <n-button type="primary" @click="openAddUserModal">新增用户</n-button>
        </n-space>
      </n-form-item>
    </n-form>
    
    <!-- 用户表格 -->
    <n-data-table :columns="columns" :data="users" :bordered="false" :loading="loading" />
    
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
    
    <!-- 用户模态框 -->
    <n-modal v-model:show="showModal" preset="card" :style="{ width: '500px' }" title="用户信息">
      <n-form :model="userForm" :rules="formRules" label-placement="left" label-width="80">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="userForm.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="userForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="角色" path="role">
          <n-select v-model:value="userForm.role" :options="roleOptions" placeholder="请选择角色" />
        </n-form-item>
        <n-form-item label="状态" path="is_active">
          <n-switch v-model:value="userForm.is_active" />
        </n-form-item>
        <n-form-item label="密码" path="password" :required="!isEditing">
          <n-input v-model:value="userForm.password" type="password" :placeholder="isEditing ? '留空则不修改密码' : '请输入密码'" />
        </n-form-item>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmitUser">确认</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </n-card>
</template>

<style scoped>
/* 可以添加一些自定义样式 */
</style>