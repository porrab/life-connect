<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import { getFirestore, collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/notificationEngine'
import { Calendar, Clock, Location, CircleCheckFilled, Loading } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const db = getFirestore()
const isLoadingHistory = ref(true)
const kycHistory = ref<any[]>([])
const bookingDetails = ref<any>(null)
const isLoading = ref(true)

const statusInfo = computed(() => {
  if (!bookingDetails.value?.status) {
    return { text: 'ไม่ทราบสถานะ', type: 'info', icon: CircleCheckFilled }
  }
  switch (bookingDetails.value.status) {
    case 'confirmed':
      return { text: 'กำลังจอง', type: 'primary', icon: Loading }
    case 'pending_verification':
      return { text: 'รอตรวจสอบเอกสาร', type: 'warning', icon: Loading }
    case 'verified':
      return { text: 'ยืนยันสำเร็จ', type: 'success', icon: CircleCheckFilled }
    default:
      return { text: bookingDetails.value.status, type: 'info', icon: CircleCheckFilled }
  }
})

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

onMounted(async () => {
  isLoading.value = true
  const bookingId = route.params.bookingId as string
  if (!bookingId) {
    ElMessage.error('no booking')
    return
  }

  try {
    const docRef = doc(db, 'bookings', bookingId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      bookingDetails.value = {
        id: docSnap.id,
        ...docSnap.data(),
      }
    } else {
      console.error('No such booking document!')
      ElMessage.error('ไม่พบข้อมูลการจอง')
    }
  } catch (error) {
    console.error('Error fetching document:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div v-if="isLoading" class="text-center mt-20">
      <p>กำลังโหลดข้อมูลการจอง...</p>
    </div>

    <div v-else-if="bookingDetails" class="max-w-md mx-auto">
      <div class="bg-white p-6 rounded-2xl shadow-md text-center">
        <QrcodeVue :value="bookingDetails.id" :size="180" level="H" class="inline-block" />
        <p class="text-gray-500 mt-4">หมายเลขการจอง</p>
        <p class="text-2xl font-bold text-gray-800 tracking-wider">{{ bookingDetails.id }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md my-5">
        <ul class="space-y-4 text-gray-700">
          <li class="flex items-center">
            <el-icon class="mr-3 text-gray-400" :size="20"><Calendar /></el-icon>
            <span>{{ formatDateTime(bookingDetails.bookingDate) }}</span>
          </li>
          <li class="flex items-center">
            <el-icon class="mr-3 text-gray-400" :size="20"><Clock /></el-icon>
            <span>{{ bookingDetails.bookingTime }}</span>
          </li>
          <li class="flex items-center">
            <el-icon class="mr-3 text-gray-400" :size="20"><Location /></el-icon>
            <span>{{ bookingDetails.locationName }}</span>
          </li>
        </ul>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-md">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">สถานะ</h2>
          <el-tag :type="statusInfo.type" effect="light" size="large">
            <el-icon class="mr-1" :class="{ 'is-loading': statusInfo.icon === Loading }"
              ><component :is="statusInfo.icon"
            /></el-icon>
            {{ statusInfo.text }}
          </el-tag>
        </div>
      </div>

      <div class="mt-8">
        <el-button
          @click="router.push({ name: 'Home' })"
          size="large"
          type="primary"
          class="w-full !bg-gray-800 !border-gray-800"
        >
          กลับหน้าหลัก
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-loading {
  animation: rotating 2s linear infinite;
}
</style>
