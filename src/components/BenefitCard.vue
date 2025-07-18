<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BenefitEvent } from '@/services/eventService'
import { Bell, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps<{ benefit: BenefitEvent }>()
const router = useRouter()

const goToDetails = () => {
  router.push({ name: 'EventPreRegister', params: { id: props.benefit.id } })
}
</script>

<template>
  <div class="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
    <div class="flex items-start space-x-4">
      <div
        class="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full"
      >
        <el-icon :size="24"><Bell /></el-icon>
      </div>
      <div class="flex-grow">
        <h2 class="text-xl font-bold">{{ benefit.title }}</h2>
        <p class="opacity-80 mt-1">{{ benefit.description }}</p>
      </div>
    </div>
    <el-button @click="goToDetails" class="w-full mt-4 !bg-white !text-blue-600">
      ดูรายละเอียด
      <el-icon class="ml-2"><ArrowRight /></el-icon>
    </el-button>
  </div>
</template>
<style scoped></style>
