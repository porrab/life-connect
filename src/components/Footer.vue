<script setup lang="ts">
import { House, Document, Bell, User } from '@element-plus/icons-vue'
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 h-16 mt-10 bg-white border-t border-gray-200 flex justify-around items-center shadow-top"
  >
    <router-link to="/" class="flex flex-col items-center space-y-1">
      <el-icon :size="24"><House /></el-icon>
      <span class="text-xs">หน้าหลัก</span>
    </router-link>

    <router-link
      :to="{ name: 'KycHistory' }"
      class="flex flex-col items-center space-y-1 text-gray-500"
    >
      <el-icon :size="24"><Document /></el-icon>
      <span class="text-xs">รายงาน</span>
    </router-link>

    <router-link
      to="/security-notification"
      class="flex flex-col items-center space-y-1 text-gray-500"
    >
      <el-icon :size="24"><Bell /></el-icon>
      <span class="text-xs">แจ้งเตือน</span>
    </router-link>

    <router-link to="/profile" class="flex flex-col items-center space-y-1 text-gray-500">
      <el-icon :size="24"><User /></el-icon>
      <span class="text-xs">โปรไฟล์</span>
    </router-link>
  </nav>
</template>

<style scoped>
.router-link-exact-active {
  color: #2563eb;
}

.shadow-top {
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}
</style>
