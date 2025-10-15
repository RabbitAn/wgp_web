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
    NSwitch,
    NCheckbox,
    NCheckboxGroup
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { ref, h, onMounted, reactive, computed } from 'vue'
import type { SelectOption } from 'naive-ui'
import { getRoleList, createRole, updateRole, deleteRole, type RoleInfo, type PermissionInfo } from '@/api/role'

// 路由
const router = useRouter()

// 角色数据
const roles = ref<RoleInfo[]>([])

// 权限数据
const permissions = ref<PermissionInfo[]>([])

// 加载状态
const loading = ref(false)

// 消息提示
const message = useMessage()

// 分页相关状态
const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0
})

// 搜索表单
const searchForm = reactive({
    name: ''
})

// 模态框相关状态
const showModal = ref(false)
const isEditing = ref(false)
const currentRoleId = ref<number | null>(null)

// 角色表单数据
const roleForm = reactive({
    name: '',
    description: '',
})

// 表单验证规则
const formRules = {
    name: {
        required: true,
        message: '请输入角色名称',
        trigger: 'blur'
    }
}

// 状态选项
const statusOptions: SelectOption[] = [
    { label: '全部', value: '' },
    { label: '激活', value: 'true' },
    { label: '未激活', value: 'false' }
]

// 计算总页数
const totalPages = computed(() => {
    return Math.ceil(pagination.itemCount / pagination.pageSize)
})

// 获取角色列表
const loadRoles = async () => {
    loading.value = true
    try {

        const response = await getRoleList({
            role_name: searchForm.name || undefined,
            page: pagination.page,
            page_size: pagination.pageSize
        })
        console.log('获取角色列表成功:', response.data)

        roles.value = response.data.roles.map(role => {
            const d = new Date(role.created_at);
            role.created_at = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
            role.updated_at = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
            return role;
        });

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
        name: 'roleDetail',
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
const openEditRoleModal = (role: RoleInfo) => {
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
            // 新增角色
            await createRole({
                name: roleForm.name,
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
    searchForm.name = ''
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
        title: 'ID',
        key: 'id',
        width: 500
    },
    {
        title: '角色名称',
        key: 'role_name'
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
        render(row: RoleInfo) {
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
                    NButton,
                    {
                        size: 'small',
                        type: 'primary',
                        style: 'margin-left: 10px',
                        onClick: () => handleEditRole(row.id)
                    },
                    { default: () => '详情' }
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
    <n-card title="角色管理">
        <!-- 搜索表单 -->
        <n-form :model="searchForm" label-placement="left" label-width="80" inline>
            <n-form-item label="角色名称">
                <n-input v-model:value="searchForm.name" placeholder="请输入角色名称" />
            </n-form-item>
            <n-form-item>
                <n-space>
                    <n-button type="primary" @click="handleSearch">搜索</n-button>
                    <n-button @click="handleReset">重置</n-button>
                    
                </n-space>
            </n-form-item>
        </n-form>

        <!-- 角色表格 -->
        <n-data-table :columns="columns" :data="roles" :bordered="false" :loading="loading" />

        <!-- 分页 -->
        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <n-pagination v-model:page="pagination.page" v-model:page-size="pagination.pageSize"
                :item-count="pagination.itemCount" @update:page="handlePageChange"
                @update:page-size="handlePageSizeChange" />
        </div>

        <!-- 角色模态框 -->
        <n-modal v-model:show="showModal" preset="card" :style="{ width: '600px' }" title="角色信息">
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