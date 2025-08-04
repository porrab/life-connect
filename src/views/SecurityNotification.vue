<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Warning, Check, Close } from '@element-plus/icons-vue'

const router = useRouter()

const notificationDetails = ref({
  service: 'เบี้ยยังชีพผู้สูงอายุ',
  timestamp: '15 ม.ค. 2567 เวลา 14:30',
  ipAddress: '192.168.1.100',
  device: 'iPhone 14 Pro',
  location: 'กรุงเทพมหานคร',
})

const handleNotMe = () => {
  ElMessageBox.confirm(
    'ระบบจะดำเนินการหยุดการเข้าถึงและแจ้งเจ้าหน้าที่เพื่อตรวจสอบความปลอดภัยทันที คุณต้องการดำเนินการต่อหรือไม่?',
    'ยืนยันการปฏิเสธการใช้งาน',
    {
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      type: 'warning',
    },
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'ดำเนินการแจ้งเจ้าหน้าที่เรียบร้อยแล้ว',
      })
      router.push('/')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'ยกเลิกการดำเนินการ',
      })
    })
}

const handleYesMe = () => {
  ElMessage.success('รับทราบการใช้งาน ขอบคุณที่ยืนยัน')
  router.push('/profile')
}
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-md mx-auto">
      <div class="text-center pt-8 pb-6">
        <el-icon :size="60" class="text-orange-400"><Warning /></el-icon>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">การแจ้งเตือนความปลอดภัย</h1>
        <p class="text-gray-500">ตรวจพบการใช้งาน KYC ของคุณ</p>
      </div>

      <div class="bg-red-50 p-6 rounded-2xl shadow-md border border-red-100 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <el-icon class="text-red-500" :size="40"><Shield /></el-icon>
          </div>
          <div class="ml-4">
            <h2 class="font-bold text-lg text-red-800">การเข้าใช้งานใหม่</h2>
            <p class="text-red-700">
              มีการใช้ข้อมูล KYC ของคุณเพื่อยื่นขอ "{{ notificationDetails.service }}"
            </p>
            <div class="mt-4 space-y-2 text-sm text-gray-700">
              <p><strong>เวลา:</strong> {{ notificationDetails.timestamp }}</p>
              <p><strong>IP Address:</strong> {{ notificationDetails.ipAddress }}</p>
              <p><strong>อุปกรณ์:</strong> {{ notificationDetails.device }}</p>
              <p><strong>ตำแหน่ง:</strong> {{ notificationDetails.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md text-center">
        <h3 class="font-semibold text-lg text-gray-800 mb-4">นี่คือการใช้งานของคุณหรือไม่?</h3>
        <p class="text-sm text-gray-500 mb-6">
          หากไม่ใช่การใช้งานของคุณ กรุณากด "ไม่ใช่ฉัน" เพื่อป้องกันการใช้งานที่ไม่ได้รับอนุญาต
        </p>
        <div class="flex justify-center space-x-4">
          <el-button @click="handleNotMe" type="danger" size="large" :icon="Close" plain>
            ไม่ใช่ฉัน
          </el-button>
          <el-button @click="handleYesMe" type="success" size="large" :icon="Check">
            ใช่ ฉันเอง
          </el-button>
        </div>
      </div>

      <div class="mt-6 bg-orange-100 text-orange-800 p-3 rounded-xl flex items-center text-sm">
        <el-icon class="mr-2"><Warning /></el-icon>
        <span>สำคัญ: หากคุณกด "ไม่ใช่ฉัน" ระบบจะหยุดการดำเนินการทันทีและแจ้งเจ้าหน้าที่</span>
      </div>

      <div class="mt-6">
        <el-button @click="router.back()" size="large" class="w-full">ย้อนกลับ</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-button.is-plain {
  --el-button-hover-text-color: var(--el-color-danger);
  --el-button-hover-border-color: var(--el-color-danger-light-5);
  --el-button-hover-bg-color: var(--el-color-danger-light-9);
}
</style>
