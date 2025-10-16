<script setup lang="ts">
import { useThemeStore } from './stores/theme'
import { darkTheme, NMessageProvider, NConfigProvider } from 'naive-ui'
import { computed } from 'vue'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.themeMode === 'dark' ? darkTheme : null)
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
/* 可以在这里添加全局样式 */
</style>