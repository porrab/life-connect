<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Clock,
  Location,
  CircleCheckFilled,
  User,
  Place,
  Files,
  Timer,
  ArrowRight,
} from '@element-plus/icons-vue'
import Process from '@/components/Process.vue'
import Heading from '@/components/Heading.vue'

const route = useRoute()
const router = useRouter()

const activeNames = ref('1')

const eventDetails = computed(() => {
  return {
    title: 'เบี้ยยังชีพผู้สูงอายุ',
    benefit: '600 บาท',
    totalBenefit: '7,200 บาท',

    requirements: [
      'อายุครบ 60 ปีขึ้นไป',
      'มีสัญชาติไทย',
      'มีที่อยู่ตามทะเบียนบ้าน',
      'ไม่ได้รับเบี้ยยังชีพประเภทอื่น',
    ],

    locationDetails: {
      place: 'สำนักงานเขตที่อยู่ตามทะเบียนบ้าน',
      time: 'เวลาทำการ: จันทร์-ศุกร์ 08:30-16:30 น.',
    },

    documents: [
      'บัตรประชาชนตัวจริง',
      'สำเนาบัตรประชาชน (หน้า-หลัง)',
      'สำเนาทะเบียนบ้าน',
      'สมุดบัญชีธนาคาร (หน้าแรก)',
    ],

    processTimeline: ['ยื่นเอกสารและตรวจสอบคุณสมบัติ', 'ประกาศผลการพิจารณา', 'เริ่มรับเบี้ยยังชีพ'],
  }
})
</script>

<template>
  <div class="container">
    <Process :percent="25"></Process>
    <Heading
      class="mb-5"
      :head="'เบี้ยเลี้ยงผู้สูงอายุ'"
      :description="'สิทธิประโยชน์ที่คุณจะได้รับ'"
    ></Heading>
    <div class="bg-green-500 text-white p-6 rounded-2xl text-center shadow-lg mb-6">
      <p class="text-4xl font-bold">{{ eventDetails.benefit }}</p>
      <p class="opacity-90">ต่อเดือน</p>
      <div class="bg-green-400 rounded-full px-4 py-1 inline-block mt-4">
        <p class="text-sm">เงินที่จะได้รับต่อปี {{ eventDetails.totalBenefit }}</p>
      </div>
    </div>

    <div class="details-collapse">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item name="1">
          <template #title>
            <div class="flex items-center">
              <el-icon class="mr-3 text-green-500" :size="20"><CircleCheckFilled /></el-icon>
              <span class="text-base font-semibold text-gray-800">เงื่อนไขการรับสิทธิ์</span>
            </div>
          </template>
          <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600 text-sm">
            <li v-for="item in eventDetails.requirements" :key="item">{{ item }}</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template #title>
            <div class="flex items-center">
              <el-icon class="mr-3 text-blue-500" :size="20"><Place /></el-icon>
              <span class="text-base font-semibold text-gray-800">สถานที่ยื่นคำขอ</span>
            </div>
          </template>
          <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600 text-sm">
            <li>{{ eventDetails.locationDetails.place }}</li>
            <li>{{ eventDetails.locationDetails.time }}</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item name="3">
          <template #title>
            <div class="flex items-center">
              <el-icon class="mr-3 text-orange-500" :size="20"><Files /></el-icon>
              <span class="text-base font-semibold text-gray-800">เอกสารที่ต้องใช้</span>
            </div>
          </template>
          <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600 text-sm">
            <li v-for="item in eventDetails.documents" :key="item">{{ item }}</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item name="4">
          <template #title>
            <div class="flex items-center">
              <el-icon class="mr-3 text-purple-500" :size="20"><Timer /></el-icon>
              <span class="text-base font-semibold text-gray-800">ขั้นตอนและระยะเวลา</span>
            </div>
          </template>
          <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600 text-sm">
            <li v-for="item in eventDetails.processTimeline" :key="item">{{ item }}</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="mt-8 space-y-3 pb-16">
      <el-button
        @click="router.push({ name: 'BookingService', params: { serviceId: 'elderly_allowance' } })"
        type="primary"
        size="large"
        class="w-full !bg-gray-800 !border-gray-800"
      >
        จองคิว <el-icon class="ml-2"><ArrowRight /></el-icon>
      </el-button>
      <el-button @click="router.go(-1)" size="large" class="w-full" style="margin-left: 0px">
        ย้อนกลับ
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.details-collapse {
  --el-collapse-border-color: transparent;
  --el-collapse-header-height: 56px;
}

.details-collapse .el-collapse-item {
  background-color: white;
  margin-bottom: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}

.details-collapse .el-collapse-item:last-child {
  margin-bottom: 0;
}

:deep(.el-collapse-item__header) {
  padding: 0 1.25rem;
  border-radius: 1rem;
}

:deep(.el-collapse-item__wrap) {
  border-radius: 1rem;
}
:deep(.el-collapse-item__content) {
  padding: 0.5rem 1.25rem 1.25rem 1.25rem;
}
</style>
