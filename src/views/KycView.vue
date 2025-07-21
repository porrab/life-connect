<script setup lang="ts">
import { ref } from 'vue'
import KycForm from '@/components/KycForm.vue'
import KycCamera from '@/components/KycCamera.vue'
import { ElLoading, ElMessage } from 'element-plus'
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const kycCameraRef = ref<InstanceType<typeof KycCamera> | null>(null)
const currentStep = ref<'form' | 'camera'>('form')

const kycData = ref<any>(null)
const kycImageSnapshot = ref<string | null>(null)
const isProcessing = ref(false)

const router = useRouter()
const userStore = useUserStore()

const onFormSubmit = (formData: any) => {
  kycData.value = formData
  currentStep.value = 'camera'
}

const handleRetake = () => {
  kycImageSnapshot.value = null

  if (kycCameraRef.value) {
    kycCameraRef.value.retakePhoto()
  }
}
const onCaptureSuccess = (snapshot: string) => {
  kycImageSnapshot.value = snapshot
}

const submitKYC = async () => {
  if (!kycData.value || !kycImageSnapshot.value) {
    ElMessage.error('ข้อมูลไม่ครบถ้วน กรุณาดำเนินการให้เสร็จสิ้น')
    return
  }
  isProcessing.value = true
  const loading = ElLoading.service({ text: 'กำลังบันทึกข้อมูล...' })

  try {
    const user = getAuth().currentUser
    if (!user) throw new Error('ไม่พบข้อมูลผู้ใช้')

    const storage = getStorage()
    const kycImageRef = storageRef(storage, 'kyc/${user.uid}/face.png')
    const base64Data = kycImageSnapshot.value.split(',')[1]
    const uploadResult = await uploadString(kycImageRef, base64Data, 'base64')
    const imageUrl = await getDownloadURL(uploadResult.ref)

    const db = getFirestore()
    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, {
      ...kycData.value,
      isVerified: true,
      kycImageUrl: imageUrl,
      kycVerifiedAt: new Date(),
    })

    userStore.setUserAsVerified(imageUrl)
    ElMessage.success('การยืนยันตัวตนสำเร็จ!')
    router.push('/profile')
  } catch (error) {
    console.error('KYC Submission Error:', error)
    ElMessage.error('เกิดข้อผิดพลาดในการยืนยันตัวตน')
  } finally {
    loading.close()
    isProcessing.value = false
  }
}
</script>

<template>
  <div>
    <KycForm v-if="currentStep === 'form'" @submit-form="onFormSubmit" />

    <div v-if="currentStep === 'camera'">
      <KycCamera ref="kycCameraRef" @capture-success="onCaptureSuccess" />

      <div v-if="kycImageSnapshot" class="text-center mt-4 space-x-4">
        <el-button @click="handleRetake" size="large">ถ่ายใหม่</el-button>
        <el-button @click="submitKYC" type="success" size="large" :loading="isProcessing">
          {{ isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยันและส่งข้อมูล' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
