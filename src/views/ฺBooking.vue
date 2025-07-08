<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const selectedDate = ref(new Date())
const selectedTime = ref('')
const bookedTimes = ref<string[]>([])
const isLoading = ref(false)

const db = getFirestore()

const fetchBookTimes = async (date: Date) => {
  const dateString = date.toISOString().split('T')[0]

  bookedTimes.value = []
  const bookingsCol = collection(db, 'bookings')
  const q = query(bookingsCol, where('bookingDate', '==', dateString))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    bookedTimes.value.push(doc.data().bookingTime)
  })

  const isTimeDisabled = (time: string) => {
    return bookedTimes.value.includes(time)
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      ElMessage('กรุณาเลือกวันและเวลาที่ต้องการ')
      return
    }
    if (isTimeDisabled(selectedTime.value)) {
      ElMessage('ช่วงเวลานี้ถูกจองแล้ว')
    }

    isLoading.value = true
    try {
      const user = userStore.userProfile
      if (!user) throw new Error('User not login')

      await addDoc(collection(db, 'bookings'), {
        userid: user.uid,
        userName: `${user.firstName} ${user.lastName}`,
        bookingDate: selectedDate.value.toISOString().split('T')[0],
        bookingTime: selectedTime.value,
        createdAt: Timestamp.now(),
      })

      ElNotification.success({
        title: 'จองคิวสำเร็จ',
        message: `คุณได้จองคิววันที่ ${selectedDate.value.toLocaleDateString('th-TH')} เวลา ${selectedTime.value} เรียบร้อยแล้ว`,
      })
    } catch (error) {
      ElMessage.error('เกิดข้อผิดพลาดในการจองคิว')
    } finally {
      isLoading.value = false
    }
  }

  watch(
    selectedDate,
    (newDate) => {
      if (newDate) {
        fetchBookTimes(newDate)
      }
    },
    { immediate: true },
  )
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">จองคิวติดต่อราชการ</h1>

    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-lg font-semibold mb-4">1. เลือกวันที่คุณสะดวก</h2>
      <v-calendar v-model="selectedDate" :min-date="new Date()" class="mb-6" />

      <h2 class="text-lg font-semibold mb-4">2. เลือกช่วงเวลา</h2>
      <el-time-select
        v-model="selectedTime"
        start="08:30"
        step="00:30"
        end="16:30"
        placeholder="เลือกช่วงเวลา"
        style="width: 100%"
      />

      <el-button type="primary" size="large" class="mt-6 w-full"> ยืนยันการจอง </el-button>
    </div>
  </div>
</template>

<style scoped></style>
