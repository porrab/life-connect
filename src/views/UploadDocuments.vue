<script setup lang="ts">
import { ref } from 'vue'
import DocumentItem from '@/components/DocumentItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import Process from '@/components/Process.vue'
import Heading from '@/components/Heading.vue'

const router = useRouter()
const route = useRoute()

const documents = ref([
  { id: 1, title: 'บัตรประชาชน (หน้า)', description: 'จำเป็น' },
  { id: 2, title: 'บัตรประชาชน (หลัง)', description: 'จำเป็น' },
  { id: 3, title: 'ทะเบียนบ้าน', description: 'จำเป็น' },
  { id: 4, title: 'สมุดบัญชีธนาคาร (หน้าแรก)', description: 'จำเป็น' },
])

const goToNextStep = () => {
  const bookingId = route.params.bookingId as string
  router.push({ name: 'BookingConfirmation', params: { bookingId: bookingId } })
}
</script>

<template>
  <div class="container">
    <Process :percent="80" class="mb-5"></Process>
    <Heading
      class="mb-5"
      :head="'อัปโหลดเอกสาร'"
      :description="'กรุณาถ่ายรูปและอัปโหลดเอกสารให้ครบถ้วน'"
    ></Heading>

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
      <el-button @click="router.go(-1)" size="large" class="w-full" style="margin-left: 0px"
        >ย้อนกลับ</el-button
      >
    </div>
  </div>
</template>

<style scoped></style>
