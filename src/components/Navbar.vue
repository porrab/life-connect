<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue' // เพิ่ม computed
import { ArrowDown, User, SwitchButton, Right, Bell } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const profilePictureUrl = computed(() => {
  if (userStore.userProfile?.kycImageUrl) {
    return userStore.userProfile.kycImageUrl
  }
  if (userStore.userProfile?.firstName) {
    return `https://api.dicebear.com/8.x/initials/svg?seed=${userStore.userProfile.firstName}`
  }
  return ''
})

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('คุณต้องการที่จะออกจากระบบใช่หรือไม่?', 'ยืนยันการออกจากระบบ', {
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      type: 'warning',
    })

    await userStore.logout()
    ElMessage.success('ออกจากระบบสำเร็จ')
    router.push({ name: 'Home' })
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Logout Error:', error)
      ElMessage.error('เกิดข้อผิดพลาดในการออกจากระบบ')
    } else {
      ElMessage.info('ยกเลิกการออกจากระบบ')
    }
  }
}

const handleCommand = (command: string | number | object) => {
  if (command === 'profile') {
    router.push({ name: 'Profile' })
  } else if (command === 'logout') {
    handleLogout()
  } else if (command === 'login') {
    router.push({ name: 'Login' })
  }
}
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="content-wrapper">
      <div class="flex justify-between items-center h-16">
        <RouterLink to="/" class="flex items-center space-x-2">
          <img src="@/assets/icon.png" alt="Live Connect Logo" class="h-8 w-auto" />
          <span class="font-bold text-xl text-gray-800">Live Connect</span>
        </RouterLink>

        <div class="flex items-center">
          <el-icon :size="20" class="mr-4"><Bell class="text-[#466BAF]" /></el-icon>
          <el-dropdown @command="handleCommand" trigger="click">
            <span
              class="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <el-avatar v-if="userStore.isLoggedIn" :size="40" :src="profilePictureUrl" />
              <el-icon v-else :size="22" class="text-gray-600"><User /></el-icon>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <template v-if="userStore.isLoggedIn">
                  <el-dropdown-item :icon="User" command="profile">โปรไฟล์</el-dropdown-item>
                  <el-dropdown-item :icon="SwitchButton" command="logout" divided
                    >ออกจากระบบ</el-dropdown-item
                  >
                </template>

                <template v-else>
                  <el-dropdown-item :icon="Right" command="login">เข้าสู่ระบบ</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.el-avatar {
  width: 100%;
  height: 100%;
}
</style>
