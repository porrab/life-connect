<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { ElLoading, ElMessage } from 'element-plus'
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// Ref for DOM element
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// state
let stream: MediaStream | null = null
const snapshot = ref<string | null>(null)
const isProcessing = ref(false)

const router = useRouter()
const userStore = useUserStore()
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

const captureImage = () => {
  if (!videoRef.value || !canvasRef.value) return

  // fix wh canvas = video
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
}

const submitKYC = () => {
  isProcessing.value = true
  const loading = ElLoading.service({
    lock: true,
    text: 'กำลังตรวจสอบข้อมูล กรุณารอสักครู่...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  setTimeout(async () => {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (user) {
        const db = getFirestore()
        const userDocRef = doc(db, 'users', user.uid)

        await updateDoc(userDocRef, {
          isVerified: true,
        })

        userStore.setUserAsVerified()

        ElMessage.success('การยืนยันตัวตนสำเร็จ!')
        router.push('/profile')
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      console.error('Failed to update verification status:', error)
      ElMessage.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      loading.close()
      isProcessing.value = false
    }
  }, 3000)
}

const recap = () => {
  startCamera()
  snapshot.value = null
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<template>
  <div class="p-4 md:p-6 text-center">
    <h1 class="text-2xl font-bold text-gray-800">ยืนยันตัวตน</h1>

    <div class="max-w-md mx-auto mt-6">
      <p v-if="!snapshot" class="text-gray-500 mb-4">กรุณาถ่ายภาพใบหน้าของคุณให้อยู่ในกรอบ</p>

      <canvas ref="canvasRef" class="hidden"></canvas>

      <video
        v-show="!snapshot"
        ref="videoRef"
        autoplay
        playsinline
        class="w-full rounded-lg shadow-lg border"
      ></video>

      <div v-if="snapshot">
        <p class="text-gray-500 mb-4">ตรวจสอบรูปภาพของคุณ</p>
        <img :src="snapshot" alt="KYC Snapshot" class="w-full rounded-lg shadow-lg border" />
      </div>

      <div class="mt-6">
        <el-button v-if="!snapshot" @click="captureImage" type="primary" size="large">
          ถ่ายรูป
        </el-button>

        <div v-if="snapshot" class="flex justify-center space-x-4">
          <el-button @click="recap()" size="large"> ถ่ายใหม่ </el-button>
          <el-button @click="submitKYC" type="success" size="large"> ยืนยันและส่งข้อมูล </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
video {
  transform: scaleX(-1);
}
</style>
