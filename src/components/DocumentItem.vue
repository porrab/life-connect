<script setup lang="ts">
import { computed } from 'vue'
import type { UploadRequestOptions } from 'element-plus'
import { Document, Download, Delete, CircleCheck, Upload } from '@element-plus/icons-vue'

const props = defineProps<{
  document: any
}>()

const emit = defineEmits(['upload', 'delete', 'download'])

const handleHttpRequest = (options: UploadRequestOptions) => {
  emit('upload', options)
}

const isUploaded = computed(() => {
  return ['success', 'รอการตรวจสอบ', 'ยืนยันแล้ว'].includes(props.document.status)
})

const fileSizeFormatted = computed(() => {
  if (!props.document.fileSize) return ''
  const sizeInMB = props.document.fileSize / (1024 * 1024)
  return `${sizeInMB.toFixed(1)} MB`
})

const uploadDateFormatted = computed(() => {
  if (!props.document.createdAt?.seconds) return ''
  return new Date(props.document.createdAt.seconds * 1000).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})

const statusInfo = computed(() => {
  switch (props.document.status) {
    case 'ยืนยันแล้ว':
      return { text: 'ยืนยันแล้ว', type: 'success' }
    case 'รอการตรวจสอบ':
      return { text: 'รอการตรวจสอบ', type: 'warning' }
    case 'success':
      return { text: 'อัปโหลดแล้ว', type: 'success' }
    default:
      return { text: props.document.description || 'ยังไม่ได้อัปโหลด', type: 'info' }
  }
})
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
    <div class="flex items-center overflow-hidden">
      <el-icon class="mr-4 text-gray-400 flex-shrink-0" :size="32">
        <CircleCheck v-if="isUploaded" class="text-green-500" />
        <Document v-else />
      </el-icon>
      <div class="truncate">
        <p class="font-semibold text-gray-800 truncate">{{ document.fileName }}</p>

        <div class="flex items-center text-sm text-gray-500 space-x-3 mt-1 flex-wrap">
          <span v-if="document.fileType"
            >{{ document.fileType.toUpperCase() }} {{ fileSizeFormatted }}</span
          >
          <span v-if="uploadDateFormatted">{{ uploadDateFormatted }}</span>
          <el-tag :type="statusInfo.type" size="small" effect="light">{{ statusInfo.text }}</el-tag>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
      <el-upload
        v-if="document.status === 'pending'"
        :show-file-list="false"
        :http-request="handleHttpRequest"
        action="#"
      >
        <el-button :icon="Upload" type="primary" text>อัปโหลด</el-button>
      </el-upload>

      <el-button v-if="document.url" @click="emit('download')" :icon="Download" circle text />
      <el-button
        v-if="document.storagePath"
        @click="emit('delete')"
        :icon="Delete"
        circle
        text
        type="danger"
      />
    </div>
  </div>
</template>
