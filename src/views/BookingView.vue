<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { ElMessage } from 'element-plus'
import { Location, ArrowRight } from '@element-plus/icons-vue'
import Heading from '@/components/Heading.vue'
import Process from '@/components/Process.vue'
import { useUserStore } from '@/stores/userStore'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const db = getFirestore()

const isBooking = ref(false)

const mapDiv = ref<HTMLElement | null>(null)
const selectedDate = ref(new Date())
const selectedTime = ref('')

const locationInfo = ref({
  name: 'สำนักงานเขตบางรัก',
  distance: 'ระยะทาง 2.5 กม. จากที่อยู่ของคุณ',
  position: { lat: 13.7274, lng: 100.5255 },
})

const timeSlots = ref([
  { value: '09:00', label: '09:00 - 09:30 น.' },
  { value: '09:30', label: '09:30 - 10:00 น.' },
  { value: '10:00', label: '10:00 - 10:30 น.', disabled: true },
  { value: '10:30', label: '10:30 - 11:00 น.' },
])

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
  selectedDate.value = day.date
  console.log('วันที่ถูกเลือกใหม่:', selectedDate.value)
}

const handleBooking = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    ElMessage.warning('กรุณาเลือกวันและเวลาให้ครบถ้วน')
    return
  }
  if (!userStore.userProfile) {
    ElMessage.error('ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่')
    return
  }

  isBooking.value = true
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

    const docRef = await addDoc(collection(db, 'bookings'), bookingData)
    console.log('Document written with ID: ', docRef.id)
    ElMessage.success('ยืนยันการจองสำเร็จ!')
  } catch (error) {
    console.error(error)
    ElMessage.error('เกิดข้อผิดพลาดในการจองคิว')
  } finally {
    isBooking.value = false
  }
}
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
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </div>

      <div class="mb-5">
        <h3 class="font-semibold mb-2 text-gray-700">วัน/เวลาที่จอง</h3>
        <p>{{ selectedDate.toLocaleDateString() }} - {{ selectedTime }}</p>
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
