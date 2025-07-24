<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore'
import { ElMessage } from 'element-plus'
import { CircleCheck, ArrowLeft } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils/notificationEngine'

const userStore = useUserStore()
const router = useRouter()
const db = getFirestore()
const isLoadingHistory = ref(true)
const kycHistory = ref<any[]>([])

const fetchKycHistory = async () => {
  if (!userStore.userProfile?.uid) return

  try {
    const historyCollection = collection(db, 'users', userStore.userProfile.uid, 'kycEvent')
    const q = query(historyCollection, orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)
    kycHistory.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching KYC history:', error)
    ElMessage.error('ไม่สามารถโหลดข้อมูลประวัติได้')
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    fetchKycHistory()
  } else {
    isLoadingHistory.value = false
  }
})
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="max-w-md mx-auto">
      <div class="relative text-center mb-6">
        <el-button
          :icon="ArrowLeft"
          @click="router.back()"
          circle
          class="absolute left-0 top-1/2 -translate-y-1/2"
        />
        <h1 class="text-2xl font-bold text-gray-800">ประวัติการใช้ KYC</h1>
        <p class="text-gray-500">รายการการยืนยันตัวตนทั้งหมด</p>
      </div>

      <div v-if="userStore.isLoading" class="text-center p-10">
        <p>กำลังโหลด...</p>
      </div>

      <div v-else-if="kycHistory.length > 0" class="space-y-4">
        <div v-for="item in kycHistory" :key="item.id" class="bg-white p-5 rounded-xl shadow-sm">
          <div class="flex justify-between items-start mb-3">
            <h2 class="font-semibold text-gray-800">{{ item.serviceName }}</h2>
            <el-tag type="success" effect="light">
              <el-icon class="mr-1"><CircleCheck /></el-icon>
              สำเร็จ
            </el-tag>
          </div>
          <div class="text-sm text-gray-500 space-y-1">
            <p>{{ formatDateTime(item.timestamp) }}</p>
            <p>IP Address: {{ item.ipAddress }}</p>
            <p>อุปกรณ์: {{ item.deviceInfo }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center bg-white p-10 rounded-xl">
        <p class="text-gray-500">ไม่พบประวัติการใช้งาน</p>
      </div>

      <div class="mt-6 bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center text-sm">
        <el-icon class="mr-3 flex-shrink-0" :size="20"><Lock /></el-icon>
        <span>ความปลอดภัย: ข้อมูลทั้งหมดถูกเข้ารหัสและเก็บอย่างปลอดภัย</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
