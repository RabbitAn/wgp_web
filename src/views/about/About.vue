<template>
  <div class="about-container">
    <div class="about-header">
      <h1>{{ appName }}</h1>
      <p class="subtitle">{{ appDescription }}</p>
    </div>
    
    <div class="cards-grid">
      <!-- 系统介绍卡片 -->
      <div class="card card-1">
        <div class="card-icon">
          <InfoCircleOutlined />
        </div>
        <h2>系统介绍</h2>
        <p>{{appName}}是{{ appDescription }}，基于 Vue 3 和 TypeScript 构建，提供了用户管理、角色权限控制等核心功能。</p>
      </div>
      
      <!-- 技术栈卡片 -->
      <div class="card card-2">
        <div class="card-icon">
          <CodeOutlined />
        </div>
        <h2>技术栈</h2>
        <ul>
          <li>Vue 3 + TypeScript</li>
          <li>Vite 构建工具</li>
          <li>Naive UI 组件库</li>
          <li>UnoCSS 原子化 CSS</li>
          <li>Pinia 状态管理</li>
        </ul>
      </div>
      
      <!-- 功能特性卡片 -->
      <div class="card card-3">
        <div class="card-icon">
          <SettingOutlined />
        </div>
        <h2>功能特性</h2>
        <ul>
          <li>响应式设计，支持多设备访问</li>
          <li>基于角色的权限管理系统</li>
          <li>用户友好的界面设计</li>
          <li>高效的前端构建和部署</li>
        </ul>
      </div>
      
      <!-- 版本信息卡片 -->
      <div class="card card-4">
        <div class="card-icon">
          <TagOutlined />
        </div>
        <h2>版本信息</h2>
        <div class="version-info">
          <p><span class="label">当前版本:</span> {{ appVersion }}</p>
          <p><span class="label">发布日期:</span> 2025年</p>
          <p><span class="label">构建状态:</span> <span class="success">稳定版</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { InfoCircleOutlined, CodeOutlined, SettingOutlined, TagOutlined } from '@vicons/antd'

const appName = import.meta.env.VITE_APP_NAME || "后台管理系统"
const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0"
const appDescription = import.meta.env.VITE_APP_DESCRIPTION || "一个现代化的管理系统解决方案"
</script>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.about-header .subtitle {
  font-size: 1.2rem;
  color: #718096;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.card {
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card-1 {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.card-2 {
  background: #f0fdf4;
  border-left: 4px solid #10b981;
}

.card-3 {
  background: #f5f3ff;
  border-left: 4px solid #8b5cf6;
}

.card-4 {
  background: #fff7ed;
  border-left: 4px solid #f97316;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.card-1 .card-icon {
  color: #3b82f6;
}

.card-2 .card-icon {
  color: #10b981;
}

.card-3 .card-icon {
  color: #8b5cf6;
}

.card-4 .card-icon {
  color: #f97316;
}

.card h2 {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 16px;
  flex-grow: 0;
}

.card p {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
  flex-grow: 1;
}

.card ul {
  padding-left: 20px;
  flex-grow: 1;
}

.card li {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.5;
}

.version-info {
  flex-grow: 1;
}

.version-info p {
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  color: #2d3748;
}

.success {
  color: #10b981;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .about-container {
    padding: 15px;
  }
  
  .cards-grid {
    gap: 20px;
  }
  
  .card {
    min-height: 200px;
  }
}
</style>