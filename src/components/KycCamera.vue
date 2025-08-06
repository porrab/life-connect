<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Heading from './Heading.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const snapshot = ref<string | null>(null)
let stream: MediaStream | null = null
const emit = defineEmits(['capture-success', 'back'])

const startCamera = async () => {
  snapshot.value = null
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('เบราว์เซอร์ของคุณไม่รองรับการใช้งานกล้อง')
    }
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 480, height: 480 },
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (error) {
    console.error('Camera access error:', error)
    ElMessage.error('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาต')
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
}

const captureImage = () => {
  if (!videoRef.value || !canvasRef.value) return

  const video = videoRef.value
  const canvas = canvasRef.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const context = canvas.getContext('2d')
  if (context) {
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
  }

  snapshot.value = canvas.toDataURL('image/png')
  stopCamera()

  emit('capture-success', snapshot.value)
}
const retakePhoto = () => {
  snapshot.value = null
  startCamera()
}

defineExpose({
  retakePhoto,
})

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<template>
  <div class="p-4 md:p-6">
    <el-icon class="hover:cursor-pointer hover:bg-gray-200 rounded-full" @click="emit('back')"
      ><ArrowLeft
    /></el-icon>
    <Heading :head="'ยืนยันตัวตนด้วยใบหน้า'"></Heading>
    <div class="max-w-md mx-auto mt-6 text-center">
      <p v-if="!snapshot" class="text-[#466baf] mb-4">กรุณาจัดใบหน้าให้อยู่ในกรอบและกดถ่ายรูป</p>

      <div
        v-show="!snapshot"
        class="relative w-64 h-64 mx-auto mb-4 overflow-hidden rounded-full border-4 border-gray-200"
      >
        <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
      </div>
      <div
        v-if="!snapshot"
        class="mx-auto w-max px-3 py-1.5 bg-amber-400/90 text-gray-800 text-xs font-semibold rounded-full"
      >
        ⚠️ กรุณาอยู่ในที่ที่มีแสงสว่างมากขึ้น
      </div>
      <canvas ref="canvasRef" class="hidden"></canvas>

      <div v-if="snapshot">
        <p class="text-[#466baf] mb-4">ตรวจสอบรูปภาพของคุณ</p>
        <img
          :src="snapshot"
          alt="KYC Snapshot"
          class="w-64 h-64 object-cover mx-auto rounded-full shadow-lg border-4 border-blue-500"
        />
      </div>

      <div class="mt-6">
        <el-button
          v-if="!snapshot"
          @click="captureImage"
          dark
          :color="'#466baf'"
          size="large"
          class="w-full max-w-xs mx-auto"
        >
          ถ่ายรูป
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
video {
  transform: scaleX(-1);
}
</style>
