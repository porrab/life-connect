<script setup>
import { computed } from 'vue'
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

    processTimeline: [
      'บัตรประชาชนตัวจริง',
      'สำเนาบัตรประชาชน (หน้า-หลัง)',
      'สำเนาทะเบียนบ้าน',
      'สมุดบัญชีธนาคาร (หน้าแรก)',
    ],
  }
})
</script>

<template>
  <div class="container">
    <Process :percent="40"></Process>
    <Heading
      class="mb-5"
      :head="'เบี้ยเลี้ยงผุู้สูงอายุ'"
      :description="'สิทธิประโยชน์ที่คุณจะได้รับ'"
    ></Heading>
    <div class="bg-green-500 text-white p-6 rounded-2xl text-center shadow-lg mb-6">
      <p class="text-4xl font-bold">{{ eventDetails.benefit }}</p>
      <p class="opacity-90">ต่อเดือน</p>
      <div class="bg-green-400 rounded-full px-4 py-1 inline-block mt-4">
        <p class="text-sm">เงินที่จะได้รับต่อปี {{ eventDetails.totalBenefit }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-white p-5 rounded-2xl shadow-sm">
        <div class="flex items-center mb-3">
          <el-icon class="mr-2 text-green-500" :size="24"><CircleCheckFilled /></el-icon>
          <h3 class="text-lg font-semibold text-gray-800">เงื่อนไขการรับสิทธิ์</h3>
        </div>
        <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600">
          <li v-for="item in eventDetails.requirements" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm">
        <div class="flex items-center mb-3">
          <el-icon class="mr-2 text-blue-500" :size="24"><Place /></el-icon>
          <h3 class="text-lg font-semibold text-gray-800">สถานที่ยื่นคำขอ</h3>
        </div>
        <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600">
          <li>{{ eventDetails.locationDetails.place }}</li>
          <li>{{ eventDetails.locationDetails.time }}</li>
        </ul>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm">
        <div class="flex items-center mb-3">
          <el-icon class="mr-2 text-orange-500" :size="24"><Files /></el-icon>
          <h3 class="text-lg font-semibold text-gray-800">เอกสารที่ต้องใช้</h3>
        </div>
        <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600">
          <li v-for="item in eventDetails.documents" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm">
        <div class="flex items-center mb-3">
          <el-icon class="mr-2 text-purple-500" :size="24"><Timer /></el-icon>
          <h3 class="text-lg font-semibold text-gray-800">ระยะเวลาที่ใช้ดำเนินการ</h3>
        </div>
        <ul class="space-y-2 pl-8 list-disc list-inside text-gray-600">
          <li v-for="item in eventDetails.processTimeline" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="mt-8 space-y-3 pb-16">
      <el-button
        @click="router.push({ name: 'Booking', params: { serviceId: 'elderly_allowance' } })"
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

<style scoped></style>
