<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const userStore = useUserStore()

const formData = ref({
  firstName: userStore.userProfile?.firstName || '',
  lastName: userStore.userProfile?.lastName || '',
  dateOfBirth: userStore.userProfile?.dateOfBirth || '',
  nationalId: userStore.userProfile?.nationalId || '',
  address: userStore.userProfile?.address || '',
  phoneNumber: userStore.userProfile?.phoneNumber || '',
  gender: userStore.userProfile?.gender || '',
})

const rules = ref<FormRules>({
  firstName: [{ required: true, message: 'กรุณากรอกชื่อ', trigger: 'blur' }],
  lastName: [{ required: true, message: 'กรุณากรอกนามสกุล', trigger: 'blur' }],
  dateOfBirth: [{ required: true, message: 'กรุณาเลือกวันเกิด', trigger: 'change' }],
  gender: [{ required: true, message: 'กรุณาเลือกเพศ', trigger: 'change' }],
  nationalId: [
    { required: true, message: 'กรุณากรอกเลขประจำตัวประชาชน', trigger: 'blur' },
    {
      pattern: /^[0-9]{13}$/,
      message: 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก',
      trigger: 'blur',
    },
  ],
  address: [{ required: true, message: 'กรุณากรอกที่อยู่', trigger: 'blur' }],
  phoneNumber: [
    { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์', trigger: 'blur' },
    { pattern: /^[0-9]{10}$/, message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก', trigger: 'blur' },
  ],
})

const emit = defineEmits(['submit-form'])

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      emit('submit-form', formData.value)
    } else {
      ElMessage.warning('กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน')
    }
  })
}
</script>

<template>
  <div class="p-4 md:p-6 text-center">
    <h1 class="text-2xl font-bold text-gray-800">ข้อมูลส่วนตัว</h1>
    <p class="text-gray-500 mb-6">กรุณาตรวจสอบและกรอกข้อมูลให้ถูกต้อง</p>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="max-w-md mx-auto text-left"
    >
      <el-form-item label="ชื่อจริง" prop="firstName">
        <el-input v-model="formData.firstName" size="large" />
      </el-form-item>

      <el-form-item label="นามสกุล" prop="lastName">
        <el-input v-model="formData.lastName" size="large" />
      </el-form-item>

      <el-form-item label="วัน/เดือน/ปีเกิด" prop="dateOfBirth">
        <el-date-picker
          v-model="formData.dateOfBirth"
          type="date"
          placeholder="เลือกวันเกิด"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          size="large"
        />
      </el-form-item>

      <el-form-item label="เพศ" prop="gender">
        <el-select v-model="formData.gender" placeholder="โปรดเลือกเพศ" size="large" class="w-full">
          <el-option label="ชาย" value="ชาย" />
          <el-option label="หญิง" value="หญิง" />
        </el-select>
      </el-form-item>

      <el-form-item label="เลขประจำตัวประชาชน" prop="nationalId">
        <el-input v-model="formData.nationalId" size="large" placeholder="กรอกตัวเลข 13 หลัก" />
      </el-form-item>

      <el-form-item label="ที่อยู่ปัจจุบัน" prop="address">
        <el-input
          v-model="formData.address"
          type="textarea"
          :rows="3"
          size="large"
          placeholder="บ้านเลขที่, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
        />
      </el-form-item>

      <el-form-item label="เบอร์โทรศัพท์" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber" size="large" placeholder="กรอกตัวเลข 10 หลัก" />
      </el-form-item>

      <el-button @click="handleSubmit(formRef)" type="primary" size="large" class="w-full mt-6">
        ต่อไป
      </el-button>
    </el-form>
  </div>
</template>
