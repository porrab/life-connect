<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { getFirestore, collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/notificationEngine'
import { Calendar, Clock, Location, User, Refresh, ArrowLeft } from '@element-plus/icons-vue'
import type { HistoryItem } from '@/types/user'
import Heading from '@/components/Heading.vue'

const userStore = useUserStore()
const router = useRouter()
const db = getFirestore()
const isLoading = ref(true)
const historyItems = ref<HistoryItem[]>([])

const fetchHistory = async () => {
  if (!userStore.userProfile?.uid) {
    ElMessage.error('ไม่พบข้อมูลผู้ใช้')
    return
  }

  isLoading.value = true
  try {
    const uid = userStore.userProfile.uid
    const combinedHistory: HistoryItem[] = []

    // Fetch KYC Events
    const kycCollection = collection(db, 'users', uid, 'kycEvents')
    const kycQuery = query(kycCollection, orderBy('timestamp', 'desc'))
    const kycSnapshot = await getDocs(kycQuery)
    kycSnapshot.forEach((doc) => {
      const data = doc.data()
      combinedHistory.push({
        id: doc.id,
        type: 'kyc',
        timestamp: data.timestamp,
        title: data.serviceName || 'การยืนยันตัวตน (KYC)',
        description: `อุปกรณ์: ${data.deviceInfo}`,
      })
    })

    // Fetch Bookings
    const bookingsCollection = collection(db, 'bookings')
    const bookingQuery = query(
      bookingsCollection,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
    )
    const bookingSnapshot = await getDocs(bookingQuery)
    bookingSnapshot.forEach((doc) => {
      const data = doc.data()
      combinedHistory.push({
        id: doc.id,
        type: 'booking',
        timestamp: data.createdAt,
        title: data.serviceName || 'การจองคิว',
        description: `${data.locationName} - ${formatThaiDate(data.bookingDate)} ${data.bookingTime}`,
        status: data.status,
      })
    })

    // Sort all items by timestamp
    historyItems.value = combinedHistory.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0
      const timeB = b.timestamp?.seconds || 0
      return timeB - timeA
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    ElMessage.error('ไม่สามารถโหลดข้อมูลประวัติได้')
  } finally {
    isLoading.value = false
  }
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { text: 'จองสำเร็จ', type: 'primary' }
    case 'pending_verification':
      return { text: 'รอตรวจสอบ', type: 'warning' }
    case 'verified':
      return { text: 'ยืนยันแล้ว', type: 'success' }
    default:
      return { text: status, type: 'info' }
  }
}

const formatThaiDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    fetchHistory()
  }
})

watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      fetchHistory()
    }
  },
)
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-xl mx-auto">
      <Heading head="ประวัติการใช้ KYC" description="รายการยืนยันตัวตนทั้งหมด"></Heading>

      <div v-if="isLoading" class="text-center mt-20">
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="historyItems.length > 0" class="space-y-4">
        <el-card v-for="item in historyItems" :key="item.id" shadow="never" class="!rounded-xl">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-800">{{ item.title }}</p>
              <p class="text-sm text-gray-500">{{ formatDateTime(item.timestamp) }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
            </div>
            <div class="flex-shrink-0 ml-4">
              <el-tag v-if="item.type === 'kyc'" type="info" effect="light">KYC</el-tag>
              <el-tag
                v-if="item.type === 'booking' && item.status"
                :type="getStatusInfo(item.status).type"
                effect="light"
              >
                {{ getStatusInfo(item.status).text }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </div>

      <div v-else class="text-center bg-white p-10 rounded-xl">
        <p class="text-gray-500">ยังไม่มีประวัติการใช้งาน</p>
      </div>
      <div class="mt-6 bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center text-sm">
        <el-icon class="mr-3 flex-shrink-0" :size="20"><Lock /></el-icon>
        <span>ความปลอดภัย: ข้อมูลทั้งหมดถูกเข้ารหัสและเก็บอย่างปลอดภัย</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-card {
  border: 1px solid #e5e7eb;
}
</style>
