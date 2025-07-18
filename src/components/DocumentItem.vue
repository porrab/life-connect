<script setup lang="ts">
import { ref } from 'vue'
import { Document, CameraFilled, CircleCheckFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  title: string
  description: string
}>()

const isUploaded = ref(false)

const handleUpload = () => {
  isUploaded.value = true
}
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
    <div class="flex items-center">
      <el-icon class="mr-4 text-gray-400" :size="24"><Document /></el-icon>
      <div>
        <p class="font-semibold text-gray-800">{{ title }}</p>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
    </div>

    <el-button v-if="!isUploaded" @click="handleUpload" type="primary" :icon="CameraFilled">
      ถ่ายรูป
    </el-button>
    <div v-else class="flex items-center text-green-500">
      <el-icon class="mr-2"><CircleCheckFilled /></el-icon>
      <span>อัปโหลดแล้ว</span>
    </div>
  </div>
</template>
