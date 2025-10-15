// 模拟API服务，用于开发环境测试

interface MockUser {
  id: number
  name: string
  email: string
  role: string
}

// 模拟用户数据
const mockUsers: MockUser[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑' },
]

// 模拟登录
export function mockLogin(username: string, password: string): Promise<{ token: string; user: MockUser }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 简单的验证逻辑
      if (username && password) {
        const user = mockUsers.find(u => u.name === username) || {
          id: Date.now(),
          name: username,
          email: `${username}@example.com`,
          role: '用户'
        }
        
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 100) // 减少延迟时间从500ms到100ms
  })
}

// 模拟获取用户列表
export function mockGetUserList(): Promise<{ users: MockUser[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        users: mockUsers,
        total: mockUsers.length
      })
    }, 100) // 减少延迟时间从300ms到100ms
  })
}

// 模拟获取用户详情
export function mockGetUserDetail(id: number): Promise<MockUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === id)
      if (user) {
        resolve(user)
      } else {
        reject(new Error('用户不存在'))
      }
    }, 100) // 减少延迟时间从300ms到100ms
  })
}