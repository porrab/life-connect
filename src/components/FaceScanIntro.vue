<script setup lang="ts">
import { ArrowRight, ArrowLeft, User, View, FullScreen, Sunny } from '@element-plus/icons-vue'

const emit = defineEmits(['next-step', 'prev-step'])
</script>

<template>
  <div class="p-4 md:p-8 bg-gray-50 min-h-screen flex flex-col justify-center items-center">
    <div class="max-w-md w-full text-center">
      <div class="mb-6">
        <div class="flex items-center justify-center w-24 h-24 mx-auto">
          <img src="../assets/face-scan.png" alt="" />
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">เตรียมสแกนใบหน้า</h1>
      <p class="text-gray-500 mb-8">สแกนใบหน้าตนเองสำหรับใช้ในการยืนยันตัวตน</p>

      <div class="space-y-4 text-left bg-white p-6 rounded-xl shadow-sm mb-8">
        <div class="flex items-center">
          <el-icon class="text-yellow-500 mr-4 flex-shrink-0" :size="32"><Sunny /></el-icon>
          <span class="text-gray-700"
            >ตรวจสอบให้แน่ใจว่าใบหน้าของคุณมีแสงสว่างเพียงพอ ไม่สว่างจนเกินไป</span
          >
        </div>
        <div class="flex items-center">
          <el-icon class="text-blue-500 mr-4 flex-shrink-0" :size="32"><User /></el-icon>
          <span class="text-gray-700">ถือโทรศัพท์ให้มั่นคง อยู่ในระดับสายตา</span>
        </div>
        <div class="flex items-center">
          <el-icon class="text-green-500 mr-4 flex-shrink-0" :size="32"><View /></el-icon>
          <span class="text-gray-700">มองตรงไปที่กล้องไม่สวมแว่นหรือแว่นกันแดด</span>
        </div>
        <div class="flex items-center">
          <el-icon class="text-purple-500 mr-4 flex-shrink-0" :size="32"><FullScreen /></el-icon>
          <span class="text-gray-700">ให้ใบหน้าอยู่ตรงกลางกรอบและไม่มีสิ่งบดบัง</span>
        </div>
      </div>

      <div class="space-y-3">
        <el-button @click="emit('next-step')" color="#466baf" size="large" class="w-full">
          ถัดไป
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
        <el-button @click="emit('prev-step')" size="large" class="w-full" style="margin-left: 0">
          <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
          ย้อนกลับ
        </el-button>
      </div>
    </div>
  </div>
</template>
