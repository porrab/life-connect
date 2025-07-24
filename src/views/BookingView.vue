<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { ElMessage } from 'element-plus'
import { Location, ArrowRight } from '@element-plus/icons-vue'
import Heading from '@/components/Heading.vue'
import Process from '@/components/Process.vue'
import { useUserStore } from '@/stores/userStore'
import {
  addDoc,
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
} from 'firebase/firestore'
import { formatDate } from '@/utils/notificationEngine'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const db = getFirestore()

const isBooking = ref(false)
const selectedDate = ref(formatDate(new Date()))
const selectedTime = ref('')
const bookedTimes = ref<string[]>([])

const mapDiv = ref<HTMLElement | null>(null)

const locationInfo = ref({
  name: 'สำนักงานเขตบางรัก',
  distance: 'ระยะทาง 2.5 กม. จากที่อยู่ของคุณ',
  position: { lat: 13.7274, lng: 100.5255 },
})

const timeSlots = computed(() => {
  const slot = []
  for (let hour = 9; hour <= 17; hour++) {
    slot.push(`${String(hour).padStart(2, '0')}:00`)
  }
  return slot
})

onMounted(async () => {
  const apiKey = import.meta.env.VITE_Maps_API_KEY

  if (!apiKey) {
    console.error('gg map api key is missing')
    return
  }

  const loader = new Loader({
    apiKey: apiKey,
    version: 'weekly',
    libraries: ['places'],
  })

  try {
    const { Map } = (await loader.importLibrary('maps')) as google.maps.MapsLibrary
    const { AdvancedMarkerElement } = (await loader.importLibrary(
      'marker',
    )) as google.maps.MarkerLibrary

    if (mapDiv.value) {
      const map = new Map(mapDiv.value, {
        center: locationInfo.value.position,
        zoom: 15,
        mapId: 'YOUR_MAP_ID',
      })

      const marker = new AdvancedMarkerElement({
        map: map,
        position: locationInfo.value.position,
        title: locationInfo.value.name,
      })
    }
  } catch (error) {
    console.error('Failed to load Google Maps:', error)
  }
})

const calendarAttrs = computed(() => [
  {
    key: 'selected',
    highlight: {
      color: 'blue',
      fillMode: 'solid',
    },
    dates: selectedDate.value,
  },
])

const handleDayClick = (day: any) => {
  selectedDate.value = formatDate(day.date)
  console.log(selectedDate.value)
}

const handleBooking = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    ElMessage.warning('กรุณาเลือกวันและเวลาให้ครบถ้วน')
    return
  }

  if (!userStore.isLoggedIn || !userStore.userProfile) {
    ElMessage.error('ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่')
    router.push('/login')
    return
  }

  isBooking.value = true

  if (import.meta.env.DEV) {
    console.log('Booking Data:', {
      userId: userStore.userProfile.uid,
      serviceId: route.params.serviceId,
      bookingDate: selectedDate.value,
      bookingTime: selectedTime.value,
    })

    setTimeout(() => {
      ElMessage.success('ยืนยันการจองสำเร็จ!')
      router.push({ name: 'UploadDocuments', params: { bookingId: 'mock-booking-id' } })
      isBooking.value = false
    }, 1500)
  } else {
    try {
      const bookingData = {
        userId: userStore.userProfile.uid,
        serviceId: route.params.serviceId,
        serviceName: 'เบี้ยยังชีพผู้สูงอายุ',
        locationName: locationInfo.value.name,
        bookingDate: selectedDate.value,
        bookingTime: selectedTime.value,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      }
      console.log('Data to be sent:', bookingData)
      console.log('Current User UID:', userStore.userProfile?.uid)

      const docRef = await addDoc(collection(db, 'bookings'), bookingData)
      console.log('Document written with ID: ', docRef.id)
      ElMessage.success('ยืนยันการจองสำเร็จ!')

      router.push({ name: 'UploadDocuments', params: { bookingId: docRef.id } })
    } catch (error) {
      console.error(error)
      ElMessage.error('เกิดข้อผิดพลาดในการจองคิว')
    } finally {
      isBooking.value = false
    }
  }
}

const fetchBookedTime = async (date: string) => {
  if (!date || !userStore.userProfile?.uid) {
    console.log('Skipping fetch: date or user profile not ready')
    bookedTimes.value = []
    return
  }

  console.log(`Fetching bookings for date: ${date} and user: ${userStore.userProfile.uid}`)
  bookedTimes.value = []
  const bookingsCol = collection(db, 'bookings')

  const q = query(
    bookingsCol,
    where('serviceId', '==', route.params.serviceId),
    where('bookingDate', '==', date),
    where('userId', '==', userStore.userProfile.uid),
  )

  try {
    const querySnapshot = await getDocs(q)
    const times: string[] = []
    querySnapshot.forEach((doc) => {
      times.push(doc.data().bookingTime)
    })
    bookedTimes.value = times
    console.log('Booked times:', bookedTimes.value)
  } catch (error) {
    console.error('Error fetching booked times:', error)
    ElMessage.error('ไม่สามารถโหลดข้อมูลการจองได้')
  }
}
watch(
  [selectedDate, () => userStore.userProfile],
  ([newDate, userProfile]) => {
    if (newDate && userProfile?.uid) {
      selectedTime.value = ''
      fetchBookedTime(newDate)
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <Process :percent="60" class="mb-5"></Process>
    <Heading :head="'จองคิว'" :description="'เลือกวันและเวลาที่สะดวก'" class="mb-5"></Heading>
    <div ref="mapDiv" class="w-full h-64 bg-gray-300"></div>
    <div class="bg-white p-6 rounded-t-3xl -mt-8 relative z-10 shadow-lg">
      <div class="flex items-start mb-6">
        <el-icon class="mr-3 mt-1 text-blue-500" :size="24"><Location /></el-icon>
        <div>
          <h2 class="text-xl font-bold text-gray-800">{{ locationInfo.name }}</h2>
          <p class="text-gray-500">{{ locationInfo.distance }}</p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-semibold mb-2 text-gray-700">เลือกวันที่</h3>
        <v-calendar
          @dayclick="handleDayClick"
          :attributes="calendarAttrs"
          borderless
          expanded
          :min-date="new Date()"
          locale="th"
          title-position="left"
        />
        <p class="text-xs text-gray-400 mt-2">*หมายเหตุ: วันที่ในอดีตไม่สามารถเลือกได้</p>
      </div>

      <div class="mb-8">
        <h3 class="font-semibold mb-2 text-gray-700">เลือกเวลา</h3>
        <el-select v-model="selectedTime" placeholder="โปรดเลือกเวลา" size="large" class="w-full">
          <el-option
            v-for="item in timeSlots"
            :key="item"
            :label="item"
            :value="item"
            :disabled="bookedTimes.includes(item)"
          />
        </el-select>
      </div>

      <div class="mb-5">
        <h3 class="font-semibold mb-2 text-gray-700">วัน/เวลาที่จอง</h3>
        <p>{{ selectedDate }} - {{ selectedTime }}</p>
      </div>

      <div class="space-y-3 pb-4">
        <el-button
          @click="handleBooking"
          type="primary"
          size="large"
          class="w-full !bg-gray-800 !border-gray-800"
          :loading="isBooking"
        >
          {{ isBooking ? 'กำลังดำเนินการ...' : 'ยืนยันการจอง' }}
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
        <el-button @click="router.go(-1)" size="large" class="w-full" style="margin-left: 0px">
          ย้อนกลับ
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vc-header .vc-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}
.vc-weekday {
  color: #9ca3af;
}
.vc-day-content:focus {
  background-color: #e0e7ff !important;
}
</style>
