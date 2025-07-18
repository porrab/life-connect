<script setup>
import ServiceCard from '@/components/ServiceCard.vue'
import { ref, computed } from 'vue'
import heart from '@/assets/heart.png'
import education from '@/assets/education.png'
import home from '@/assets/home.png'
import setting from '@/assets/setting.png'
import { useUserStore } from '@/stores/userStore'
import { Bell, ArrowRight } from '@element-plus/icons-vue'
import { getRelevantNotification } from '@/utils/notificationEngine'
import Heading from '@/components/Heading.vue'

const services = ref([
  { title: 'สุขภาพ', icon: heart },
  { title: 'การศึกษา', icon: education },
  { title: 'ที่อยู่อาศัย', icon: home },
  { title: 'อื่นๆ', icon: setting, link: { name: 'Benefits' } },
])
const userStore = useUserStore()

const userName = computed(() => {
  return userStore.userProfile?.firstName || 'คุณผู้ใช้101'
})

const mainNotification = computed(() => {
  console.log(userStore.userProfile)
  if (userStore.userProfile) {
    const notification = getRelevantNotification(userStore.userProfile)
    console.log(notification)
    return getRelevantNotification(userStore.userProfile)
  }
})
</script>

<template>
  <div class="container">
    <Heading
      :head="`สวัสดีคุณ ${userName}`"
      :description="`ระบบ AI ช่วยดูแลสิทธิประโยชน์ของคุณ`"
    ></Heading>

    <div>
      <div v-if="mainNotification">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">การแจ้งเตือน</h2>
        <div class="bg-white ...">
          <RouterLink :to="{ name: 'EventPreRegister', params: { id: mainNotification.id } }">
            <div class="flex-grow">
              <div class="flex items-center space-x-2">
                <h3 class="font-bold text-gray-800">{{ mainNotification.title }}</h3>
                <span v-if="mainNotification.isNew" class="bg-blue-100 ...">ใหม่</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ mainNotification.description }}</p>
              <p v-if="mainNotification.benefit" class="text-sm font-semibold text-green-600 mt-2">
                <span class="mr-1">💵</span> {{ mainNotification.benefit }}
                <el-icon class="ml-5"><ArrowRight /></el-icon>
              </p>
            </div>
          </RouterLink>
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
            :link="service.link"
          >
          </ServiceCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
