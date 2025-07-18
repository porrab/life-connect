<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import QrcodeVue from 'qrcode.vue'
import { Calendar, Clock, Location, Bell, Phone } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const db = getFirestore()

const isLoading = ref(false)
const bookingDetails = ref<any>(null)

const formatThaiDate = (dateObj: Date) => {
  return new Date(dateObj).toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const bookingId = route.params.bookingId as string
  if (!bookingId || bookingId === 'mock-booking-id') {
    bookingDetails.value = {
      bookingId: 'BK-240115-001',
      bookingDate: new Date(),
      bookingTime: '09:00 u.',
      locationName: 'สำนักงานเขตบางรัก',
    }
    isLoading.value = false
    return
  }

  try {
    const docRef = doc(db, 'bookings', bookingId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()

      bookingDetails.value = {
        ...data,
        bookingId: docSnap.id,
        bookingDate: data.bookingDate.toDate(),
      }
    } else {
      console.error('No such document!')
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
            <span>{{ formatThaiDate(bookingDetails.bookingDate) }}</span>
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

      <div class="space-y-3">
        <div class="bg-green-100 text-green-800 p-4 rounded-xl flex items-center text-sm">
          <el-icon class="mr-3 flex-shrink-0"><CircleCheckFilled /></el-icon>
          <span>เสร็จสิ้น: เอกสารของคุณถูกส่งไปยังเจ้าหน้าที่แล้ว</span>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm flex items-center text-sm text-gray-600">
          <el-icon class="mr-3 text-blue-500 flex-shrink-0"><Bell /></el-icon>
          <span>แจ้งเตือนอัตโนมัติ: ระบบจะแจ้งเตือนล่วงหน้า 1 วัน</span>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm flex items-center text-sm text-gray-600">
          <el-icon class="mr-3 text-blue-500 flex-shrink-0"><Phone /></el-icon>
          <span>ติดต่อสำนักงานเขต: 02-234-5678 (จันทร์-ศุกร์ 08:30-16:30 น.)</span>
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

<style scoped></style>
