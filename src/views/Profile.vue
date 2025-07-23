<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Edit, ArrowRight, Document, Refresh, Bell } from '@element-plus/icons-vue'
import { calculateAge } from '@/utils/notificationEngine'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => {
  return userStore.userProfile
})
const isVerified = computed(() => {
  return userStore.userProfile?.isVerified || false
})

const startKYC = () => {
  router.push({ name: 'Kyc' })
}
const profilePictureUrl = computed(() => {
  if (userStore.userProfile?.kycImageUrl) {
    return userStore.userProfile.kycImageUrl
  }
  return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})
const ageInfo = computed(() => {
  if (!user.value?.dateOfBirth) return 'N/A'
  return calculateAge(user.value.dateOfBirth)
})
const formattedBirthDate = computed(() => {
  if (!user.value?.dateOfBirth) return ''
  const date = new Date(user.value.dateOfBirth)
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <div class="container">
    <div v-if="user" class="max-w-md mx-auto">
      <div class="text-center pt-6 pb-4">
        <el-avatar :size="100" :src="profilePictureUrl" class="border-4 border-white shadow-lg" />
        <h1 class="text-2xl font-bold mt-4 text-gray-800">
          คุณ {{ user.firstName }} {{ user.lastName }}
        </h1>
        <p v-if="user.nationalId" class="text-gray-500">
          เลขประจำตัวประชาชน: {{ user.nationalId }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-md mb-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">สถานะ KYC</h2>
          <el-tag :type="isVerified ? 'success' : 'warning'" effect="light" size="large">
            <el-icon class="mr-1"><Check /></el-icon>
            {{ isVerified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน' }}
          </el-tag>
        </div>
        <ul class="mt-4 space-y-2 text-sm text-gray-600">
          <li class="flex items-center">
            <el-icon class="mr-2" :class="isVerified ? 'text-green-500' : 'text-gray-400'"
              ><Check
            /></el-icon>
            ข้อมูลส่วนตัว
            <span
              class="ml-auto font-medium"
              :class="isVerified ? 'text-green-500' : 'text-gray-400'"
              >{{ isVerified ? 'ยืนยันแล้ว' : '-' }}</span
            >
          </li>
          <li class="flex items-center">
            <el-icon class="mr-2" :class="isVerified ? 'text-green-500' : 'text-gray-400'"
              ><Check
            /></el-icon>
            ที่อยู่ตามทะเบียนบ้าน
            <span
              class="ml-auto font-medium"
              :class="isVerified ? 'text-green-500' : 'text-gray-400'"
              >{{ isVerified ? 'ยืนยันแล้ว' : '-' }}</span
            >
          </li>
          <li class="flex items-center">
            <el-icon class="mr-2" :class="isVerified ? 'text-green-500' : 'text-gray-400'"
              ><Check
            /></el-icon>
            หมายเลขโทรศัพท์
            <span
              class="ml-auto font-medium"
              :class="isVerified ? 'text-green-500' : 'text-gray-400'"
              >{{ isVerified ? 'ยืนยันแล้ว' : '-' }}</span
            >
          </li>
        </ul>
        <el-button v-if="!isVerified" @click="startKYC" type="primary" class="w-full mt-4">
          ดำเนินการยืนยันตัวตน
        </el-button>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">ข้อมูลส่วนตัว</h2>
          <el-button :icon="Edit" text circle />
        </div>

        <div class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <label class="text-gray-500">ชื่อ-นามสกุล</label>
            <p class="font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName }}</p>
          </div>
          <div>
            <label class="text-gray-500">อายุ</label>
            <p class="font-semibold text-gray-800">{{ ageInfo }}</p>
          </div>
          <div>
            <label class="text-gray-500">วันเกิด</label>
            <p class="font-semibold text-gray-800">{{ formattedBirthDate }}</p>
          </div>
          <div>
            <label class="text-gray-500">เพศ</label>
            <p class="font-semibold text-gray-800">{{ user.gender || 'ชาย' }}</p>
          </div>
        </div>

        <div class="space-y-4 text-sm mt-5">
          <div class="flex items-start">
            <div>
              <label class="text-gray-500">ที่อยู่</label>
              <p class="font-semibold text-gray-800">{{ user.address || 'ยังไม่มีข้อมูล' }}</p>
            </div>
          </div>
          <div class="flex items-start">
            <div>
              <label class="text-gray-500">เบอร์โทรศัพท์</label>
              <p class="font-semibold text-gray-800">{{ user.phoneNumber || 'ยังไม่มีข้อมูล' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-white p-5 rounded-xl shadow-md my-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        @click="router.push({ name: 'Edoc' })"
      >
        <div class="flex items-center">
          <el-icon class="mr-4 text-gray-500" :size="24"><Document /></el-icon>
          <div>
            <span class="font-semibold">e-doc</span>
            <p class="text-sm text-gray-500">เอกสารอิเล็กทรอนิกส์</p>
          </div>
        </div>
        <el-icon class="text-gray-400"><ArrowRight /></el-icon>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">การตั้งค่าความปลอดภัย</h2>
        <div class="space-y-3">
          <div
            class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <el-icon class="mr-3 text-blue-500"><Refresh /></el-icon>
              <div>
                <p class="font-semibold">ประวัติการใช้ KYC</p>
                <p class="text-xs text-gray-500">ดูประวัติการยืนยันตัวตนทั้งหมด</p>
              </div>
            </div>
            <el-icon class="text-gray-400"><ArrowRight /></el-icon>
          </div>

          <div
            class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <el-icon class="mr-3 text-red-500"><Bell /></el-icon>
              <div>
                <p class="font-semibold">การแจ้งเตือนความปลอดภัย</p>
                <p class="text-xs text-gray-500">ตั้งค่าการแจ้งเตือน 2FA</p>
              </div>
            </div>
            <div class="flex items-center">
              <el-tag type="danger" effect="dark" round class="mr-2">1</el-tag>
              <el-icon class="text-gray-400"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-10">
      <p>กำลังโหลดข้อมูลผู้ใช้...</p>
    </div>
  </div>
</template>
<style></style>
