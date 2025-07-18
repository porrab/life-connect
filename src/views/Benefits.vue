<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { getRelevantEvents } from '@/services/eventService'
import BenefitCard from '@/components/BenefitCard.vue'

const userStore = useUserStore()

const relevantBenefits = computed(() => {
  if (userStore.userProfile) {
    return getRelevantEvents(userStore.userProfile)
  }
  return []
})
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">สิทธิประโยชน์สำหรับคุณ</h1>

    <div v-if="relevantBenefits.length > 0">
      <BenefitCard v-for="benefit in relevantBenefits" :key="benefit.id" :benefit="benefit" />
    </div>

    <div v-else class="text-center text-gray-500 mt-16">
      <p class="text-lg">ยังไม่พบสวัสดิการที่แนะนำสำหรับคุณในขณะนี้</p>
      <p>เราจะแจ้งให้ทราบเมื่อมีรายการอัปเดต</p>
    </div>
  </div>
</template>
