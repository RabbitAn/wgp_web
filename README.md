# WGP 管理系统前端

本项目是基于 Vue 3 和 Vite 构建的现代化管理系统前端模板，帮助您快速启动和开发 Web 应用。

## 推荐的 IDE 设置

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (请禁用 Vetur 插件)。

## 推荐的浏览器设置

- 基于 Chromium 的浏览器 (Chrome, Edge, Brave 等)：
  - [Vue.js 开发者工具](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [在 Chrome 开发者工具中启用自定义对象格式化](http://bit.ly/object-formatters)
- Firefox：
  - [Vue.js 开发者工具](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [在 Firefox 开发者工具中启用自定义对象格式化](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## TypeScript 对 `.vue` 导入的支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` 进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 来使 TypeScript 语言服务识别 `.vue` 类型。

## 环境配置

本项目使用环境变量进行配置。可用的配置文件如下：

- `.env`: 默认环境变量
- `.env.staging`: 预发布环境变量
- `.env.production`: 生产环境变量
- `.env.example`: 环境变量示例文件 (复制为 `.env` 后使用)

### 可用环境变量

- `VITE_API_BASE_URL`: API 基础 URL
- `VITE_APP_NAME`: 应用名称
- `VITE_APP_VERSION`: 应用版本
- `VITE_APP_DESCRIPTION`: 应用描述
- `VITE_DEFAULT_THEME`: 默认主题 (light/dark)
- `VITE_DEFAULT_PAGE_SIZE`: 分页默认页面大小

## 项目技术栈

- **框架**: Vue 3.5.22
- **构建工具**: Vite 7.1.7
- **语言**: TypeScript 5.9.x
- **状态管理**: Pinia 3.0.3
- **UI 组件库**: Naive UI 2.43.1
- **CSS 框架**: UnoCSS 66.5.3
- **路由**: Vue Router 4.5.1
- **HTTP 客户端**: Axios 1.12.2
- **进度条**: NProgress 0.2.0

## 自定义配置

请参考 [Vite 配置文档](https://vite.dev/config/)。

## 项目设置

```sh
pnpm install
```

### 编译并启动开发服务器

```sh
pnpm dev
```

### 编译并启动预发布环境开发服务器

```sh
pnpm dev:staging
```

### 类型检查、编译和生产环境构建

```sh
pnpm build
```

### 类型检查、编译和预发布环境构建

```sh
pnpm build:staging
```

### 类型检查

```sh
pnpm type-check
```

### 预览生产构建

```sh
pnpm preview
```

## 项目结构

```
src/
├── api/          # API 接口封装
├── components/   # 公共组件
├── layouts/      # 页面布局
├── router/       # 路由配置
├── stores/       # 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
├── views/        # 页面视图
├── App.vue       # 根组件
└── main.ts       # 入口文件
```

## 开发规范

1. 使用 TypeScript 进行开发，确保类型安全
2. 遵循 Vue 3 Composition API 风格
3. 组件命名使用 PascalCase 格式
4. CSS 类名使用 BEM 命名规范
5. 提交代码前运行类型检查和代码格式化

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request