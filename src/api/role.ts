import request from '@/utils/request'

// 角色信息接口
export interface RoleInfo {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

// 角色列表响应
export interface RoleListResponse {
  roles: RoleInfo[]
  total: number
  page: number
  page_size: number
}

// 角色查询参数
export interface RoleQueryParams {
  role_name?: string
  page?: number
  page_size?: number
}

// 创建角色请求
export interface CreateRoleRequest {
  name: string

}

// 更新角色请求
export interface UpdateRoleRequest {
  name?: string
  description?: string

}

// 获取角色列表
export async function getRoleList(params?: RoleQueryParams) {
  return await request.get<RoleListResponse>('/role/roles', { params })
}

// 获取角色详情
export async function getRoleDetail(id: number | string) {
  return await request.get<RoleInfo>(`/role/roles/${id}`)
}

// 创建角色
export async function createRole(data: CreateRoleRequest) {
  return await request.post<RoleInfo>('/role/roles', data)
}

// 更新角色
export async function updateRole(id: number | string, data: UpdateRoleRequest) {
  return await request.put<RoleInfo>(`/role/roles/${id}`, data)
}

// 删除角色
export async function deleteRole(id: number | string) {
  return await request.delete(`/role/roles/${id}`)
}

// 获取所有权限列表
export interface PermissionInfo {
  id: number
  name: string
  description: string
}

