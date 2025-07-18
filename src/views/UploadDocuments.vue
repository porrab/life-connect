<script setup>
import { ref } from 'vue'
import DocumentItem from '@/components/DocumentItem.vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const documents = ref([
  { id: 1, title: 'บัตรประชาชน (หน้า)', description: 'จำเป็น' },
  { id: 2, title: 'บัตรประชาชน (หลัง)', description: 'จำเป็น' },
  { id: 3, title: 'ทะเบียนบ้าน', description: 'จำเป็น' },
  { id: 4, title: 'สมุดบัญชีธนาคาร (หน้าแรก)', description: 'จำเป็น' },
])

const goToNextStep = () => {}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">อัปโหลดเอกสาร</h1>
    <p class="text-gray-500 mb-6">กรุณาถ่ายรูปและอัปโหลดเอกสารให้ครบถ้วน</p>

    <div class="space-y-4">
      <DocumentItem
        v-for="doc in documents"
        :key="doc.id"
        :title="doc.title"
        :description="doc.description"
      />
    </div>

    <div class="mt-6 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm text-center">
      <p>คำแนะนำ: ถ่ายรูปให้ชัดเจน ไม่เบลอ และครบทุกมุมของเอกสาร</p>
    </div>

    <div class="mt-8 space-y-3 pb-16">
      <el-button
        @click="goToNextStep"
        type="primary"
        size="large"
        class="w-full !bg-gray-800 !border-gray-800"
      >
        ดำเนินการต่อ
        <el-icon class="ml-2"><ArrowRight /></el-icon>
      </el-button>
      <el-button @click="router.go(-1)" size="large" class="w-full">ย้อนกลับ</el-button>
    </div>
  </div>
</template>

<style scoped></style>
