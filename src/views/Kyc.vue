<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null

const startCamera = async () => {
  if (navigator.mediaDevices) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })

      if (videoRef.value && stream) {
        videoRef.value.srcObject = stream
      }
    } catch (error) {
      console.log('error access camera')
      ElMessage.error('ไม่สามารถเข้าถึงกล้องได้')
    }
  } else {
    ElMessage.error('เบราว์เซอร์ของคุณไม่รองรับการใช้งานกล้อง')
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  startCamera()
})
</script>

<template>
  <div class="p-4 md:p-6 text-center">
    <h1 class="text-2xl font-bold text-gray-800">ยืนยันตัวตน</h1>
    <p class="text-gray-500 mt-2 mb-6">กรุณาถ่ายภาพใบหน้าของคุณให้อยู่ในกรอบ</p>

    <div class="max-w-md mex-auto">
      <video ref="videoRef" autoplay playsinline class="w-full rounded-lg shadow-lg border"></video>

      <el-button type="primary" size="large" class="mt-6"> ถ่ายรูป </el-button>
    </div>
  </div>
</template>

<style scoped>
video {
  transform: scaleX(-1);
}
</style>
