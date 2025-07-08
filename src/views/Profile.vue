<script setup>
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isVerified = computed(() => {
  userStore.userProfile?.isVerified || false
})

const startKYC = () => {
  router.push('/kyc')
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">โปรไฟล์ของฉัน</h1>

    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div v-if="userStore.userProfile" class="space-y-4">
        <p>
          <strong>ชื่อ:</strong> {{ userStore.userProfile.firstName }}
          {{ userStore.userProfile.lastName }}
        </p>
        <p><strong>อีเมล:</strong> {{ userStore.userProfile.email }}</p>

        <div class="flex items-center space-x-2">
          <strong>สถานะการยืนยันตัวตน:</strong>
          <div class="text-center">
            <el-tag v-if="isVerified" type="success" effect="dark" round>
              <el-icon class="px-8"><Check />ยืนยันแล้ว</el-icon>
            </el-tag>
            <el-tag v-else type="danger" effect="dark" round>
              <el-icon class="px-8"><Close /> ยังไม่ยืนยัน</el-icon>
            </el-tag>
          </div>
        </div>

        <el-button v-if="!isVerified" type="primary" @click="startKYC">
          ยืนยันตัวตน (KYC)
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
