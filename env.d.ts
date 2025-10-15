/// <reference types="vite/client" />

// 扩展 ImportMetaEnv 接口
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  // 添加其他环境变量...
}

// 扩展 ImportMeta 接口
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 添加全局变量声明（如果需要）
declare global {
  interface Window {
    // 添加全局变量类型定义（如果需要）
  }
}

export {}