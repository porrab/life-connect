<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { Bell } from '@element-plus/icons-vue'

const userStore = useUserStore()
</script>

<template>
  <header class="flex justify-between items-center p-4 bg-white shadow-sm">
    <router-link :to="{ name: 'Home' }">
      <div class="flex items-center space-x-2">
        <img src="@/assets/icon.png" class="w-8 h-8" alt="Live Connect Logo" />
        <span class="font-bold text-lg text-gray-800">Live Connect</span>
      </div>
    </router-link>
    <router-link :to="{ name: 'Login' }" class="text-blue-600 hover:underline">Login</router-link>
    <div class="flex items-center space-x-4">
      <el-button :icon="Bell" circle />
      <span>{{ userStore.userProfile?.firstName }}</span>
      <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
    </div>
  </header>
</template>
