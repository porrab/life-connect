<script setup lang="ts">
import { type FormRules, type FormInstance, ElNotification, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const router = useRouter()
const formRef = ref<FormInstance | undefined>(undefined)
const isLoading = ref(false)

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  password: '',
  confirmPassword: '',
})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('กรุณายืนยันรหัสผ่าน'))
  } else if (value !== formData.value.password) {
    callback(new Error('รหัสผ่านทั้งสองช่องไม่ตรงกัน!'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
  firstName: [{ required: true, message: 'กรุณากรอกชื่อ', trigger: 'blur' }],
  lastName: [{ required: true, message: 'กรุณากรอกนามสกุล', trigger: 'blur' }],
  email: [
    { required: true, message: 'กรุณากรอกอีเมล', trigger: 'blur' },
    { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง', trigger: ['blur', 'change'] },
  ],
  dateOfBirth: [{ required: true, message: 'กรุณาเลือกวันเกิด', trigger: 'change' }],
  password: [
    { required: true, message: 'กรุณากรอกรหัสผ่าน', trigger: 'blur' },
    { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', trigger: 'blur' },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  try {
    await formEl.validate()
  } catch (validationError) {
    ElMessage.error('กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน')
    console.log(validationError)
    return
  }
  isLoading.value = true

  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password,
    )
    const user = userCredential.user
    const db = getFirestore()
    await setDoc(doc(db, 'users', user.uid), {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      dateOfBirth: formData.value.dateOfBirth,
      createdAt: new Date(),
    })

    ElNotification({
      title: 'สำเร็จ',
      message: 'สมัครสมาชิกสำเร็จ!!!',
      type: 'success',
    })
    router.push('/')
  } catch (error: any) {
    let message = 'Error occurred pls try again'
    if (error.code === 'auth/email-already-in-use') {
      message = 'this email already in use'
    }
    ElMessage.error(message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-row justify-center h-auto mt-5">
    <img src="@/assets/icon.png" class="w-10 my-auto" alt="" />
    <h1 class="my-auto">live-connect</h1>
  </div>

  <div class="register-container">
    <h2>สร้างบัญชีใหม่</h2>
    <el-form
      class="register-form"
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="ชื่อ" prop="firstName">
            <el-input v-model="formData.firstName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="นามสกุล" prop="lastName">
            <el-input v-model="formData.lastName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="อีเมล" prop="email">
        <el-input v-model="formData.email" placeholder="example@email.com" />
      </el-form-item>

      <el-form-item label="วันเกิด" prop="dateOfBirth" class="w-full">
        <el-date-picker
          v-model="formData.dateOfBirth"
          type="date"
          placeholder="เลือกวันเกิด"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="รหัสผ่าน" prop="password">
        <el-input v-model="formData.password" type="password" show-password />
      </el-form-item>

      <el-form-item label="ยืนยันรหัสผ่าน" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" type="password" show-password />
      </el-form-item>

      <el-form-item>
        <el-button @click="submitForm(formRef)" type="primary" :loading="isLoading" class="w-full">
          สมัครสมาชิก
        </el-button>
      </el-form-item>
    </el-form>
    <div class="text-center mt-5">
      มีบัญชีอยู่แล้ว?
      <router-link :to="{ name: 'Login' }" class="text-blue-600 hover:underline"
        >เข้าสู่ระบบ</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.register-container h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}
.register-container p {
  text-align: center;
  color: #606266;
  margin-bottom: 2rem;
}
</style>
