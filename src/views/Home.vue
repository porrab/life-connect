<script setup>
import ServiceCard from '@/components/ServiceCard.vue'
import { ref, computed } from 'vue'
import heart from '@/assets/heart.png'
import education from '@/assets/education.png'
import home from '@/assets/home.png'
import setting from '@/assets/setting.png'
import { useUserStore } from '@/stores/userStore'
import { Bell } from '@element-plus/icons-vue'
import { getRelevantNotification } from '@/utils/notificationEngine'
const services = ref([
  { title: 'สุขภาพ', icon: heart },
  { title: 'การศึกษา', icon: education },
  { title: 'ที่อยู่อาศัย', icon: home },
  { title: 'อื่นๆ', icon: setting },
])
const userStore = useUserStore()

const userName = computed(() => {
  return userStore.userProfile?.firstName || 'คุณผู้ใช้101'
})

const mainNotification = computed(() => {
  if (userStore.userProfile) {
    return getRelevantNotification(userStore.userProfile)
  }
})
</script>

<template>
  <div class="container space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-800">สวัสดีคุณ {{ userName }}</h1>
      <p class="text-sm text-gray-500">ระบบ AI ช่วยดูแลสิทธิประโยชน์ของคุณ</p>
    </div>

    <div>
      <h2 class="text-lg font-semibold text-gray-700 mb-2">การแจ้งเตือน</h2>
      <!-- <div
        class="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center space-x-4 cursor-pointer hover:bg-gray-50"
      >
        <div class="bg-blue-100 p-3 rounded-full">
          <el-icon :size="24" color="#2563eb"><Bell /></el-icon>
        </div>

        <div class="flex-grow">
          <div class="flex items-center space-x-2">
            <h3 class="font-bold text-gray-800">เบี้ยยังชีพผู้สูงอายุ</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >ใหม่</span
            >
          </div>
          <p class="text-sm text-gray-600 mt-1">
            คุณจะมีอายุครบ 60 ปี ในอีก 3 เดือน สามารถยื่นขอเบี้ยยังชีพได้แล้ว
          </p>
          <p class="text-sm font-semibold text-green-600 mt-2">
            <span class="mr-1">💵</span> 600 บาท / เดือน
          </p>
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div> -->

      <div v-if="mainNotification">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">การแจ้งเตือน</h2>
        <div class="bg-white ...">
          <div class="flex-grow">
            <div class="flex items-center space-x-2">
              <h3 class="font-bold text-gray-800">{{ mainNotification.title }}</h3>
              <span v-if="mainNotification.isNew" class="bg-blue-100 ...">ใหม่</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ mainNotification.description }}</p>
            <p v-if="mainNotification.benefit" class="text-sm font-semibold text-green-600 mt-2">
              <span class="mr-1">💵</span> {{ mainNotification.benefit }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">บริการอื่นๆ</h2>
        <div class="grid grid-cols-2 gap-4">
          <ServiceCard
            v-for="service in services"
            :key="service.title"
            :title="service.title"
            :iconSrc="service.icon"
          >
          </ServiceCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
