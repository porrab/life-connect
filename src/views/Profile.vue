<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Check,
  ArrowRight,
  Document,
  Clock,
  Warning,
  ArrowUp,
  ArrowDown,
  Close,
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

// State for controlling collapsible sections
const activeCollapse = ref(['personalInfo'])

const user = computed(() => userStore.userProfile)
const isVerified = computed(() => user.value?.isVerified || false)

const profilePictureUrl = computed(() => {
  return (
    user.value?.kycImageUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  )
})

// Computed property to format National ID with dashes
const formattedNationalId = computed(() => {
  const id = user.value?.nationalId
  if (!id || id.length !== 13) return id
  return `${id[0]}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id[12]}`
})

// Computed property to calculate age in years and months
const ageInfo = computed(() => {
  if (!user.value?.dateOfBirth) return { years: 0, months: 0 }
  const birthDate = new Date(user.value.dateOfBirth)
  const today = new Date()

  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()

  if (today.getDate() < birthDate.getDate()) {
    months--
  }
  if (months < 0) {
    years--
    months += 12
  }
  return { years, months }
})

// Computed property to format birth date in Thai format
const formattedBirthDate = computed(() => {
  if (!user.value?.dateOfBirth) return ''
  const date = new Date(user.value.dateOfBirth)
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})

const startKYC = () => {
  router.push({ name: 'Kyc' })
}
</script>

<template>
  <div class="bg-gray-50 pb-20">
    <div v-if="user" class="max-w-md mx-auto p-4">
      <div class="text-center pt-6 pb-4">
        <el-avatar :size="100" :src="profilePictureUrl" class="border-4 border-white shadow-lg" />
        <h1 class="text-2xl font-bold mt-4 text-gray-800">
          คุณ {{ user.firstName }} {{ user.lastName }}
        </h1>
        <p v-if="user.nationalId" class="text-gray-500 text-sm">
          เลขประจำตัวประชาชน: {{ formattedNationalId }}
        </p>
      </div>

      <div
        class="p-5 rounded-xl mb-6 shadow-sm"
        :class="{ 'bg-orange-50': !isVerified, 'bg-green-50': isVerified }"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">สถานะ KYC</h2>
          <el-tag
            v-if="userStore.userProfile?.isVerified"
            type="success"
            effect="dark"
            size="large"
            round
          >
            <el-icon class="mr-1"><Check /></el-icon>
            ยืนยันแล้ว
          </el-tag>
          <el-tag
            v-else="userStore.userProfile?.isVerified"
            type="warning"
            effect="dark"
            size="large"
            round
          >
            ยังไม่ได้ยืนยัน
          </el-tag>
        </div>
        <ul class="mt-4 space-y-2 text-sm text-gray-700">
          <li
            v-for="item in [
              'ข้อมูลส่วนตัว',
              'ที่อยู่ตามทะเบียนบ้าน',
              'หมายเลขโทรศัพท์',
              'ข้อมูลทางการเงิน',
            ]"
            :key="item"
            class="flex items-center"
          >
            <el-icon v-if="isVerified" class="mr-2 text-green-500"><Check /></el-icon>
            <el-icon v-else class="mr-2 text-orange-800"><Close /></el-icon>
            {{ item }}
            <span
              class="ml-auto font-medium"
              :class="{ 'text-green-600': isVerified, 'text-orange-800': !isVerified }"
              >{{ isVerified ? 'ยืนยันแล้ว' : 'ยังไม่ได้ยืนยัน' }}</span
            >
          </li>
        </ul>
        <el-button v-if="!isVerified" @click="startKYC" type="primary" class="w-full mt-4">
          ดำเนินการยืนยันตัวตน
        </el-button>
      </div>

      <el-collapse v-model="activeCollapse" accordion class="custom-collapse">
        <el-collapse-item name="personalInfo">
          <template #title>
            <h2 class="text-lg font-semibold text-gray-800">ข้อมูลส่วนตัว</h2>
          </template>
          <div class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <label class="text-gray-500">ชื่อ-นามสกุล</label>
              <p class="font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName }}</p>
            </div>
            <div>
              <label class="text-gray-500">อายุ</label>
              <p class="font-semibold text-gray-800">
                {{ ageInfo.years }} ปี {{ ageInfo.months }} เดือน
              </p>
            </div>
            <div>
              <label class="text-gray-500">วันเกิด</label>
              <p class="font-semibold text-gray-800">{{ formattedBirthDate }}</p>
            </div>
            <div>
              <label class="text-gray-500">เพศ</label>
              <p class="font-semibold text-gray-800">{{ user.gender || 'ชาย' }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-gray-500">ที่อยู่</label>
              <p class="font-semibold text-gray-800">{{ user.address || 'ยังไม่มีข้อมูล' }}</p>
            </div>
            <div>
              <label class="text-gray-500">เบอร์โทรศัพท์</label>
              <p class="font-semibold text-gray-800">
                {{ user.phoneNumber || 'ยังไม่มีข้อมูล' }}
              </p>
            </div>
            <el-icon class="text-gray-400 justify-self-end"><ArrowRight /></el-icon>
          </div>
        </el-collapse-item>

        <el-collapse-item name="financialInfo">
          <template #title>
            <h2 class="text-lg font-semibold text-gray-800">ข้อมูลทางการเงิน</h2>
          </template>
          <p class="text-gray-500 text-sm p-4 text-center">ยังไม่มีข้อมูลทางการเงิน</p>
        </el-collapse-item>
      </el-collapse>

      <div
        class="bg-white p-4 my-6 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        @click="router.push({ name: 'Edoc' })"
      >
        <div class="flex items-center">
          <div class="bg-blue-100 p-2 rounded-full mr-4 w-10 h-10 flex">
            <el-icon class="text-blue-500" :size="24"><Document /></el-icon>
          </div>
          <div>
            <span class="font-semibold text-gray-800">e-doc</span>
            <p class="text-sm text-gray-500">เอกสารอิเล็กทรอนิกส์</p>
          </div>
        </div>
        <el-icon class="text-gray-400"><ArrowRight /></el-icon>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-3">การตั้งค่าความปลอดภัย</h2>
        <div class="space-y-3">
          <div
            @click="router.push({ name: 'KycHistory' })"
            class="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="bg-purple-100 p-2 rounded-full mr-4 w-10 h-10 flex">
                <el-icon class="text-purple-500 mx-auto my-auto"><Clock /></el-icon>
              </div>
              <div>
                <p class="font-semibold">ประวัติการใช้ KYC</p>
                <p class="text-xs text-gray-500">ดูประวัติการยืนยันตัวตนทั้งหมด</p>
              </div>
            </div>
            <el-icon class="text-gray-400"><ArrowRight /></el-icon>
          </div>

          <div
            @click="router.push({ name: 'SecurityNotification' })"
            class="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="bg-orange-100 p-2 rounded-full mr-4 flex w-10 h-10">
                <el-icon class="text-orange-500 mx-auto my-auto"><Warning /></el-icon>
              </div>
              <div>
                <p class="font-semibold">การแจ้งเตือนความปลอดภัย</p>
                <p class="text-xs text-gray-500">ตั้งค่าการแจ้งเตือน 2FA</p>
              </div>
            </div>
            <div class="flex items-center">
              <el-badge :value="1" type="danger" class="mr-2" />
              <el-icon class="text-gray-400"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-20">
      <p>กำลังโหลดข้อมูลผู้ใช้...</p>
    </div>
  </div>
</template>

<style>
.custom-collapse {
  border: none;
}
.custom-collapse .el-collapse-item__header {
  border: none;
  background-color: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}
.custom-collapse .el-collapse-item__header.is-active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 0;
}
.custom-collapse .el-collapse-item__wrap {
  border: none;
  background-color: white;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 1rem;
}
.custom-collapse .el-collapse-item__content {
  padding: 1.25rem;
  padding-top: 0;
}
</style>
