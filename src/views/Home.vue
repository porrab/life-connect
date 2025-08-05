<script setup lang="ts">
import ServiceCard from '@/components/ServiceCard.vue'
import { ref, computed } from 'vue'
import heart from '@/assets/heartX4.png'
import education from '@/assets/educationX4.png'
import home from '@/assets/homeX4.png'
import setting from '@/assets/settingX4.png'
import { useUserStore } from '@/stores/userStore'
import { Bell, ArrowRight, Wallet } from '@element-plus/icons-vue'
import { getRelevantNotification } from '@/utils/notificationEngine'
import Heading from '@/components/Heading.vue'

const services = ref([
  { title: 'สุขภาพ', description: 'ตรวจสุขภาพฟรี', icon: heart },
  { title: 'การศึกษา', description: 'ทุนการศึกษา', icon: education },
  { title: 'ที่อยู่อาศัย', description: 'บ้านประชารัฐ', icon: home },
  { title: 'อื่นๆ', description: 'บริการทั่วไป', icon: setting, link: { name: 'Benefits' } },
])
const userStore = useUserStore()

const userName = computed(() => {
  return userStore.userProfile?.firstName || 'คุณ'
})

const mainNotification = computed(() => {
  if (userStore.userProfile) {
    return getRelevantNotification(userStore.userProfile)
  }
  return null
})
</script>

<template>
  <div class="container">
    <Heading
      class="mb-8"
      :head="`สวัสดี, ${userName}`"
      description="ระบบ AI ช่วยดูแลสิทธิประโยชน์ของคุณ"
    />

    <div class="max-w-md mx-auto">
      <div v-if="mainNotification">
        <h2 class="text-lg font-semibold text-gray-800 mb-3 px-1">การแจ้งเตือน</h2>
        <RouterLink
          :to="{ name: 'EventDetail', params: { id: mainNotification.id } }"
          class="block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
        >
          <div class="flex items-start space-x-4">
            <div
              class="flex-shrink-0 bg-blue-50 text-blue-500 rounded-full w-12 h-12 flex items-center justify-center"
            >
              <el-icon :size="24"><Bell /></el-icon>
            </div>
            <div class="flex-grow">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-800">{{ mainNotification.title }}</h3>
                <span
                  v-if="mainNotification.isNew"
                  class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >ใหม่</span
                >
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ mainNotification.description }}</p>
              <div
                v-if="mainNotification.benefit"
                class="flex items-center justify-between text-green-600 mt-3"
              >
                <div class="flex items-center">
                  <el-icon class="mr-2"><Wallet /></el-icon>
                  <span class="font-semibold text-sm">{{ mainNotification.benefit }}</span>
                </div>
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-3 px-1">บริการอื่นๆ</h2>
        <div class="grid grid-cols-2 gap-4">
          <ServiceCard
            v-for="service in services"
            :key="service.title"
            :title="service.title"
            :description="service.description"
            :iconSrc="service.icon"
            :link="service.link"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding-bottom: 5rem;
}
</style>
