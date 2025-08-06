<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Camera,
  Upload,
  User as UserIcon,
  Document as DocumentIcon,
  ArrowRight,
} from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const userStore = useUserStore()

const isNationalIdDisabled = ref(false)
const isDateOfBirthDisabled = ref(false)

const formData = ref({
  nationalId: userStore.userProfile?.nationalId || '',
  firstName: userStore.userProfile?.firstName || '',
  lastName: userStore.userProfile?.lastName || '',
  englishName: userStore.userProfile?.englishName || '',
  dateOfBirth: userStore.userProfile?.dateOfBirth || '',
  address: userStore.userProfile?.address || '',
  isSameAddress: true,
  currentAddress: '',
  phoneNumber: '',
  email: '',
})

const rules = ref<FormRules>({
  nationalId: [
    { required: true, message: 'กรุณากรอกเลขประจำตัวประชาชน', trigger: 'blur' },
    {
      pattern: /^[0-9]{13}$/,
      message: 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก',
      trigger: 'blur',
    },
  ],
  firstName: [{ required: true, message: 'กรุณากรอกชื่อ', trigger: 'blur' }],
  lastName: [{ required: true, message: 'กรุณากรอกนามสกุล', trigger: 'blur' }],
  englishName: [{ required: true, message: 'กรุณากรอกชื่อภาษาอังกฤษ', trigger: 'blur' }],
  dateOfBirth: [{ required: true, message: 'กรุณาเลือกวันเกิด', trigger: 'change' }],
  address: [{ required: true, message: 'กรุณากรอกที่อยู่ตามทะเบียนบ้าน', trigger: 'blur' }],
  currentAddress: [{ required: true, message: 'กรุณากรอกที่อยู่ปัจจุบัน', trigger: 'blur' }],
  phoneNumber: [
    { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์', trigger: 'blur' },
    { pattern: /^[0-9]{10}$/, message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'กรุณากรอกอีเมล', trigger: 'blur' },
    { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง', trigger: ['blur', 'change'] },
  ],
})

const mockDataForMissingFields = {
  nationalId: '1102003456789',
  dateOfBirth: '1960-08-20',
  address: '99 หมู่ 18 ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี 12120',
}

const autoFillForm = () => {
  const profile = userStore.userProfile
  if (!profile) {
    ElMessage.error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง')
    return
  }

  formData.value = {
    ...formData.value,

    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    englishName: profile.englishName || '',

    nationalId: mockDataForMissingFields.nationalId,
    dateOfBirth: mockDataForMissingFields.dateOfBirth,
    address: mockDataForMissingFields.address,
  }

  isNationalIdDisabled.value = true
  isDateOfBirthDisabled.value = true
  ElMessage.success('กรอกข้อมูลอัตโนมัติสำเร็จ')

  setTimeout(() => {
    formRef.value?.validate()
  }, 100)
}

const handleTakePhoto = () => {
  autoFillForm()
}
const handleUploadPhoto = () => {
  autoFillForm()
}

const emit = defineEmits(['submit-form'])

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const payload = {
        nationalId: formData.value.nationalId,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        englishName: formData.value.englishName,
        dateOfBirth: formData.value.dateOfBirth,
        address: formData.value.isSameAddress
          ? formData.value.address
          : formData.value.currentAddress,
        phoneNumber: formData.value.phoneNumber,
        email: formData.value.email,
      }
      emit('submit-form', payload)
    } else {
      ElMessage.warning('กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน')
    }
  })
}

watch(
  () => userStore.userProfile,
  (profile) => {
    if (profile && !isNationalIdDisabled.value) {
      formData.value.firstName = profile.firstName || ''
      formData.value.lastName = profile.lastName || ''
      formData.value.englishName = profile.englishName || ''
      formData.value.email = profile.email || ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-4 md:p-6 bg-gray-50">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="max-w-md mx-auto space-y-6"
    >
      <div class="bg-white p-5 rounded-xl shadow-sm">
        <div class="flex items-center mb-4">
          <el-icon class="mr-3 text-blue-500" :size="24"><DocumentIcon /></el-icon>
          <div>
            <h2 class="font-semibold text-gray-800">สแกนบัตรประชาชน</h2>
            <p class="text-xs text-gray-500">
              ถ่ายรูปหรืออัปโหลดรูปบัตรประชาชนเพื่อกรอกข้อมูลอัตโนมัติ
            </p>
          </div>
        </div>
        <div class="flex space-x-4">
          <el-button
            @click="handleTakePhoto"
            :icon="Camera"
            color="#466baf"
            class="w-full"
            size="large"
            dark
            >ถ่ายรูป</el-button
          >
          <el-button @click="handleUploadPhoto" :icon="Upload" class="w-full" size="large" dark
            >อัปโหลดรูป</el-button
          >
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-sm">
        <div class="flex items-center mb-4">
          <el-icon class="mr-3 text-blue-500" :size="24"><UserIcon /></el-icon>
          <div>
            <h2 class="font-semibold text-gray-800">ข้อมูลส่วนตัว</h2>
            <p class="text-xs text-gray-500">กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน</p>
          </div>
        </div>
        <el-form-item label="เลขประจำตัวประชาชน" prop="nationalId">
          <el-input v-model="formData.nationalId" size="large" :disabled="true" />
        </el-form-item>

        <el-form-item label="ชื่อ - นามสกุล">
          <el-row :gutter="10" class="w-full">
            <el-col :span="12">
              <el-form-item prop="firstName" class="!mb-0">
                <el-input v-model="formData.firstName" size="large" placeholder="ชื่อ" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="lastName" class="!mb-0">
                <el-input v-model="formData.lastName" size="large" placeholder="นามสกุล" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="Name" prop="englishName">
          <el-input v-model="formData.englishName" size="large" placeholder="English Name" />
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
            :disabled="true"
          />
        </el-form-item>

        <el-form-item label="ที่อยู่ตามทะเบียนบ้าน" prop="address">
          <el-input
            v-model="formData.address"
            type="textarea"
            :rows="3"
            size="large"
            placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
          />
        </el-form-item>

        <el-checkbox v-model="formData.isSameAddress"
          >ที่อยู่ปัจจุบันเป็นที่อยู่เดียวกับทะเบียนบ้าน</el-checkbox
        >

        <transition name="el-fade-in">
          <div v-if="!formData.isSameAddress" class="mt-4">
            <el-form-item label="ที่อยู่ปัจจุบัน" prop="currentAddress">
              <el-input
                v-model="formData.currentAddress"
                type="textarea"
                :rows="3"
                size="large"
                placeholder="กรอกที่อยู่ปัจจุบัน"
              />
            </el-form-item>
          </div>
        </transition>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-sm">
        <div class="flex items-center mb-4">
          <el-icon class="mr-3 text-blue-500" :size="24"><UserIcon /></el-icon>
          <div>
            <h2 class="font-semibold text-gray-800">ข้อมูลเพิ่มเติม</h2>
            <p class="text-xs text-gray-500">กรุณากรอกข้อมูลเพิ่มเติม</p>
          </div>
        </div>
        <el-form-item label="เบอร์โทรศัพท์" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" size="large" placeholder="กรอกตัวเลข 10 หลัก" />
        </el-form-item>
        <el-form-item label="อีเมล" prop="email">
          <el-input v-model="formData.email" size="large" placeholder="example@email.com" />
        </el-form-item>
      </div>

      <div class="space-y-3 pb-8">
        <el-button
          @click="handleSubmit(formRef)"
          dark
          :color="'#466baf'"
          size="large"
          class="w-full"
        >
          ถัดไป
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
        <el-button @click="router.go(-1)" size="large" class="w-full" style="margin-left: 0">
          ย้อนกลับ
        </el-button>
      </div>
    </el-form>
  </div>
</template>
