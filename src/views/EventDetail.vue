<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Clock, Location, CircleCheckFilled } from '@element-plus/icons-vue'
const route = useRoute()
const eventDetails = computed(() => {
  return {
    title: 'เบี้ยยังชีพผู้สูงอายุ',
    ageCondition: 'อายุครบ 60 ปีขึ้นไป',
    nationality: 'มีสัญชาติไทย',
    benefit: '600 บาท/เดือน',
    totalBenefit: '7,200 บาท/ปี',
    checklist: [
      'ทะเบียนบ้านฉบับเจ้าบ้าน (ตัวจริง)',
      'บัตรประจำตัวประชาชน (ตัวจริง)',
      'สมุดบัญชีเงินฝากธนาคาร (ตัวจริง)',
    ],
    location: 'สำนักงานเขต/เทศบาล/อบต. ตามทะเบียนบ้าน',
    time: '08:30-16:30 น.',
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-800">{{ eventDetails.title }}</h1>
      <p class="text-sm text-gray-500">สิทธิประโยชน์ที่คุณจะได้รับ</p>
    </div>

    <div class="bg-green-100 p-6 rounded-xl text-center">
      <p class="text-green-800 font-semibold">คุณจะได้รับ</p>
      <p class="text-4xl font-bold text-green-700 my-2">{{ eventDetails.benefit }}</p>
      <p class="text-green-600">คิดเป็น {{ eventDetails.totalBenefit }}</p>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">คุณสมบัติและเอกสารที่ต้องใช้</h3>
      <ul class="space-y-2">
        <li class="flex items-center">
          <el-icon color="green" class="mr-2"><CircleCheckFilled /></el-icon>
          <span>{{ eventDetails.ageCondition }}</span>
        </li>
        <li class="flex items-center">
          <el-icon color="green" class="mr-2"><CircleCheckFilled /></el-icon>
          <span>{{ eventDetails.nationality }}</span>
        </li>
        <li v-for="item in eventDetails.checklist" :key="item" class="flex items-center">
          <el-icon color="green" class="mr-2"><CircleCheckFilled /></el-icon>
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">สถานที่ยื่นคำขอ</h3>
      <p class="flex items-center">
        <el-icon class="mr-2"><Location /></el-icon>
        <span>{{ eventDetails.location }}</span>
      </p>
      <p class="flex items-center mt-2">
        <el-icon class="mr-2"><Clock /></el-icon>
        <span>เวลาทำการ: {{ eventDetails.time }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
