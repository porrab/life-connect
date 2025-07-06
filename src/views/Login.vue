<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
const router = useRouter()
const formRef = ref<FormInstance>()
const isLoading = ref(false)

const formData = ref({
  email: '',
  password: '',
})

const rules = ref<FormRules>({
  email: [{ required: true, message: 'pls put email', trigger: 'blur' }],
  password: [{ required: true, message: 'pls put password', trigger: 'blur' }],
})

const handleLogin = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      const auth = getAuth()
      try {
        await signInWithEmailAndPassword(auth, formData.value.email, formData.value.password)
        router.push('/')
      } catch (error: any) {
        let message = 'error occurred!'
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          message = 'invalid email or password'
        }
        ElMessage.error(message)
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="flex flex-row justify-center h-auto mt-5">
    <img src="@/assets/icon.png" class="w-10 my-auto" alt="" />
    <h1 class="my-auto">live-connect</h1>
  </div>
  <div class="login-container">
    <h2>เข้าสู่ระบบ Life-Connect</h2>

    <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="login-form">
      <el-form-item label="อีเมล" prop="email">
        <el-input v-model="formData.email" placeholder="กรอกอีเมลของคุณ" />
      </el-form-item>

      <el-form-item label="รหัสผ่าน" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="กรอกรหัสผ่าน"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleLogin" :loading="isLoading" class="w-full">
          เข้าสู่ระบบ
        </el-button>
      </el-form-item>
    </el-form>

    <div class="text-center mt-5">
      ยังไม่มีบัญชี?
      <router-link to="/register" class="text-blue-600 hover:underline"
        >สมัครสมาชิกที่นี่</router-link
      >
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.login-container h2 {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
