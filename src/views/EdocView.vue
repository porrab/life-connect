<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { ElMessage, ElLoading, type UploadFile, ElMessageBox } from 'element-plus'
import { Search, UploadFilled, Plus } from '@element-plus/icons-vue'
import DocumentItem from '@/components/DocumentItem.vue'

const userStore = useUserStore()
const router = useRouter()
const db = getFirestore()
const storage = getStorage()

const documents = ref<any[]>([])
const searchQuery = ref('')

const filteredDocuments = computed(() => {
  if (!searchQuery.value) {
    return documents.value
  }
  return documents.value.filter((doc) => {
    return doc.fileName.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const fetchDocuments = async () => {
  if (!userStore.userProfile?.uid) return
  try {
    const docsCollection = collection(db, 'users', userStore.userProfile.uid, 'documents')
    const querySnapshot = await getDocs(docsCollection)
    documents.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching documents:', error)
    ElMessage.error('ไม่สามารถโหลดข้อมูลเอกสารได้')
  }
}

const handleFileUpload = async (options: { file: File }) => {
  if (!userStore.userProfile?.uid) return
  const loading = ElLoading.service({ text: 'กำลังอัปโหลด...' })
  const file = options.file
  const docType = file.name.split('.').pop()

  try {
    // 1. Upload to Storage
    const docRef = storageRef(
      storage,
      `documents/${userStore.userProfile.uid}/${Date.now()}_${file.name}`,
    )
    const snapshot = await uploadBytes(docRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    // 2. Add document info to Firestore
    const docsCollection = collection(db, 'users', userStore.userProfile.uid, 'documents')
    await addDoc(docsCollection, {
      fileName: file.name,
      fileType: docType,
      fileSize: file.size,
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      status: 'รอการตรวจสอบ',
      createdAt: serverTimestamp(),
    })

    ElMessage.success('อัปโหลดเอกสารสำเร็จ!')
    await fetchDocuments() // Refresh the list
  } catch (error) {
    console.error('Upload failed:', error)
    ElMessage.error('อัปโหลดเอกสารไม่สำเร็จ')
  } finally {
    loading.close()
  }
}

const handleDownload = (url: string) => {
  window.open(url, '_blank')
}

const handleDelete = async (docId: string, storagePath: string) => {
  if (!userStore.userProfile?.uid) return

  try {
    await ElMessageBox.confirm(
      'คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้? การกระทำนี้ไม่สามารถย้อนกลับได้',
      'ยืนยันการลบ',
      {
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        type: 'warning',
        center: true,
      },
    )
    const loading = ElLoading.service({ text: 'กำลังลบเอกสาร...' })
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'users', userStore.userProfile.uid, 'documents', docId))

      // 2. Delete from Storage
      const fileRef = storageRef(storage, storagePath)
      await deleteObject(fileRef)

      ElMessage.success('ลบเอกสารสำเร็จ!')
      await fetchDocuments() // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error)
      ElMessage.error('ลบเอกสารไม่สำเร็จ')
    } finally {
      loading.close()
    }
  } catch (action) {
    if (action === 'cancel') {
      ElMessage.info('การลบถูกยกเลิก')
    }
  }
}
watch(
  () => userStore.isLoading,
  (loading) => {
    if (loading === false && userStore.userProfile) {
      fetchDocuments()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen pb-20">
    <div class="max-w-xl mx-auto">
      <div class="text-center mb-8">
        <el-icon class="text-blue-500" :size="48"><Document /></el-icon>
        <h1 class="text-3xl font-bold text-gray-800 mt-2">เอกสารอิเล็กทรอนิกส์</h1>
        <p class="text-gray-500">จัดการเอกสารสำคัญของคุณ</p>
      </div>

      <el-upload
        :show-file-list="false"
        :http-request="handleFileUpload"
        drag
        action="#"
        class="mb-6"
      >
        <div
          class="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-dashed w-full"
        >
          <div class="flex items-center">
            <el-icon class="text-gray-400 mr-3" :size="32"><UploadFilled /></el-icon>
            <span class="text-gray-500">อัปโหลดเอกสารใหม่</span>
          </div>
          <el-button type="primary" :icon="Plus">เพิ่มเอกสาร</el-button>
        </div>
      </el-upload>

      <el-input
        v-model="searchQuery"
        placeholder="ค้นหาเอกสาร"
        :prefix-icon="Search"
        size="large"
        class="mb-6"
      />

      <h2 class="text-xl font-semibold text-gray-800 mb-4">เอกสารของคุณ</h2>
      <div v-if="userStore.isLoading" class="text-center p-8">
        <p>กำลังโหลด...</p>
      </div>
      <div v-else-if="filteredDocuments.length > 0" class="space-y-3">
        <DocumentItem
          v-for="doc in filteredDocuments"
          :key="doc.id"
          :document="doc"
          @download="handleDownload(doc.url)"
          @delete="handleDelete(doc.id, doc.storagePath)"
        />
      </div>
      <div v-else class="text-center bg-white p-8 rounded-xl">
        <p class="text-gray-500">ไม่พบเอกสาร</p>
      </div>

      <div class="mt-6 bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center text-sm">
        <el-icon class="mr-3 flex-shrink-0" :size="20"><Lock /></el-icon>
        <span>ความปลอดภัย: ข้อมูลทั้งหมดถูกเข้ารหัสและเก็บอย่างปลอดภัย</span>
      </div>
      
      <el-button @click="router.back()" size="large" class="w-full mt-8"> ย้อนกลับ </el-button>
    </div>
  </div>
</template>

<style scoped></style>
