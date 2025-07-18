<script setup lang="ts">
import { getEventById, type BenefitEvent } from '@/services/eventService'
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const event = ref<BenefitEvent | null>(null)

const userProfile = computed(() => {
  return userStore.userProfile
})

const ageInfo = computed(() => {
  if (!userProfile.value?.dateOfBirth) {
    return { years: 0, months: 0, days: 0 }
  }
  const birthDate = new Date(userProfile.value.dateOfBirth)
  const today = new Date()

  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  let days = today.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  return { years, months, days }
})

const timeUntil60 = computed(() => {
  if (!userProfile.value?.dateOfBirth) {
    return { months: 0, days: 0 }
  }
  const birthDate = new Date(userProfile.value.dateOfBirth)
  const date60th = new Date(birthDate.getFullYear() + 60, birthDate.getMonth(), birthDate.getDate())
  const today = new Date()

  let months =
    (date60th.getFullYear() - today.getFullYear()) * 12 + (date60th.getMonth() - today.getMonth())
  let days = date60th.getDate() - today.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months === 0 && days <= 0) {
    return { months: 0, days: 0 }
  }

  if (months < 0) months = 0

  return { months, days }
})

onMounted(() => {
  const eventId = route.params.id as string
  const foundEvent = getEventById(eventId)
  if (foundEvent) {
    event.value = foundEvent
  } else {
    router.push('/')
  }
})

const goToDetails = () => {
  router.push({ name: 'EventDetail', params: { id: event.value?.id } })
}

const goBackToHome = () => {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6 px-4">
      <div class="text-blue-600 font-bold">เริ่มต้น</div>
      <div class="flex-grow h-1 bg-gray-200 mx-4 rounded-full relative">
        <div class="absolute top-0 left-0 h-1 bg-blue-600 rounded-full" style="width: 20%"></div>
      </div>
      <div class="text-gray-400">สิ้นสุด</div>
    </div>

    <div v-if="event && userProfile" class="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
      <div class="text-center mb-6">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4"
        >
          <el-icon :size="40"><Bell /></el-icon>
        </div>
        <h1 class="text-2xl font-bold">แจ้งเตือนสำคัญ</h1>
      </div>

      <div class="bg-blue-500 p-4 rounded-xl text-center mb-6">
        <p class="text-lg">คุณ{{ userProfile.firstName }}</p>
        <p class="text-sm opacity-80">อายุ {{ ageInfo.years }} ปี {{ ageInfo.months }} เดือน</p>
      </div>

      <div class="text-center">
        <div v-if="ageInfo.years < 60">
          <p class="text-lg">คุณจะอายุครบ 60 ปี</p>
          <p class="my-2">
            ในอีก
            <span class="text-3xl font-bold text-yellow-300">{{ timeUntil60.months }}</span> เดือน
          </p>
          <p class="opacity-80">
            สนใจลงทะเบียนขอรับเบี้ยยังชีพผู้สูงอายุ
            <br />
            ล่วงหน้าหรือไม่?
          </p>
        </div>

        <div v-else>
          <p class="text-xl font-bold">คุณมีคุณสมบัติตามเกณฑ์</p>
          <p class="text-lg mt-2">สามารถลงทะเบียนเพื่อขอรับ</p>
          <p class="text-2xl font-bold text-yellow-300 my-2">เบี้ยยังชีพผู้สูงอายุ</p>
          <p class="opacity-80">ได้แล้ววันนี้</p>
        </div>
      </div>
    </div>

    <div class="mt-8 space-y-4">
      <el-button
        @click="goToDetails"
        type="primary"
        size="large"
        class="w-full !bg-gray-800 !border-gray-800"
      >
        ดูรายละเอียด
      </el-button>
      <el-button @click="goBackToHome" size="large" class="w-full ml-0" style="margin-left: 0px">
        กลับหน้าหลัก
      </el-button>
    </div>
  </div>
</template>

<style scoped></style>
