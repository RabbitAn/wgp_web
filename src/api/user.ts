import request from '@/utils/request'
import type { UserInfo } from '@/stores/user'

// 用户登录
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  role: string
  username: string
  
}

export async function login(data: LoginRequest) {
  console.log('登录请求参数：', data)
  // 根据API文档，登录接口是 /login
  return await request.post<LoginResponse>('/login', data)

 
}

// 获取用户列表
export interface UserListResponse {
  users: UserInfo[]
  total: number
  page: number
  page_size: number
}

export interface UserQueryParams {
  username?: string
  email?: string
  role?: string
  phone?: string
  is_active?: boolean
  page?: number
  page_size?: number
}

export function getUserList(params?: UserQueryParams) {
  // 根据API文档，用户列表接口是 /userusers
  return request.get<UserListResponse>('/userusers', { params })
}

// 获取用户详情
export function getUserDetail(id: number | string) {
  // 根据API文档，用户详情接口是 /userusers/{user_id}
  return request.get<UserInfo>(`/userusers/${id}`)
}

// 创建用户
export interface CreateUserRequest {
  username?: string
  email?: string
  role: string
  password?: string
  phone?: string
  is_active?: boolean
}

export async function createUser(data: CreateUserRequest) {
  // 根据API文档，创建用户接口是 /userusers
  return await request.post<UserInfo>('/userusers', data)
}

// 更新用户
export function updateUser(id: number | string, data: Partial<CreateUserRequest>) {
  // 根据API文档，更新用户接口是 /userusers/{user_id}
  return request.put<UserInfo>(`/userusers/${id}`, data)
}

// 删除用户
export function deleteUser(id: number | string) {
  // 根据API文档，删除用户接口是 /userusers/{user_id}
  return request.delete(`/userusers/${id}`)
}