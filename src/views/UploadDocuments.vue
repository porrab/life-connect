<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import DocumentItem from '@/components/DocumentItem.vue'
import Process from '@/components/Process.vue'
import Heading from '@/components/Heading.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const db = getFirestore()
const storage = getStorage()
const bookingId = route.params.bookingId as string

const requiredDocs = ref([
  { id: 1, title: 'บัตรประชาชน (หน้า)', description: 'จำเป็น' },
  { id: 2, title: 'บัตรประชาชน (หลัง)', description: 'จำเป็น' },
  { id: 3, title: 'ทะเบียนบ้าน', description: 'จำเป็น' },
  { id: 4, title: 'สมุดบัญชีธนาคาร (หน้าแรก)', description: 'จำเป็น' },
])

const existingDocuments = ref<any[]>([])

const displayDocuments = computed(() => {
  return requiredDocs.value.map((reqDoc) => {
    const existing = existingDocuments.value.find((exDoc) => exDoc.fileName.includes(reqDoc.title))

    if (existing) {
      return {
        ...reqDoc,
        ...existing,
        status: 'success',
      }
    } else {
      return {
        ...reqDoc,
        fileName: reqDoc.title,
        status: 'pending',
      }
    }
  })
})

const fetchExistingDocuments = async () => {
  if (!userStore.userProfile?.uid) return
  try {
    const docsCollection = collection(db, 'users', userStore.userProfile.uid, 'documents')
    const querySnapshot = await getDocs(docsCollection)
    existingDocuments.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching existing documents:', error)
  }
}

const handleUpload = async (options: { file: File }, documentItem: any) => {
  if (!userStore.userProfile?.uid) return
  const file = options.file
  const targetDoc = displayDocuments.value.find((d) => d.id === documentItem.id)
  if (targetDoc) targetDoc.status = 'uploading'

  try {
    const filePath = `documents/${userStore.userProfile.uid}/${Date.now()}_${file.name}`
    const fileRef = storageRef(storage, filePath)
    const snapshot = await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    const docsCollection = collection(db, 'users', userStore.userProfile.uid, 'documents')
    await addDoc(docsCollection, {
      fileName: documentItem.title,
      originalFileName: file.name,
      fileType: file.type.split('/')[1],
      fileSize: file.size,
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      status: 'รอการตรวจสอบ',
      createdAt: serverTimestamp(),
    })

    ElMessage.success(`${file.name} อัปโหลดสำเร็จ!`)
    await fetchExistingDocuments()
  } catch (error) {
    if (targetDoc) targetDoc.status = 'error'
    console.error('Upload Error:', error)
    ElMessage.error('อัปโหลดไฟล์ไม่สำเร็จ')
  }
}

const handleDelete = async (documentItem: any) => {
  if (!userStore.userProfile?.uid || !documentItem.storagePath) return
  try {
    await deleteDoc(doc(db, 'users', userStore.userProfile.uid, 'documents', documentItem.id))
    const fileRef = storageRef(storage, documentItem.storagePath)
    await deleteObject(fileRef)

    ElMessage.info('ลบไฟล์แล้ว')
    await fetchExistingDocuments()
  } catch (error) {
    console.error('Delete Error:', error)
    ElMessage.error('ไม่สามารถลบไฟล์ได้')
  }
}

const goToNextStep = async () => {
  const allRequiredUploaded = displayDocuments.value.every((doc) => doc.status === 'success')
  if (!allRequiredUploaded) {
    ElMessage.warning('กรุณาอัปโหลดเอกสารที่จำเป็นให้ครบถ้วน')
    return
  }

  try {
    const bookingDocRef = doc(db, 'bookings', bookingId)
    const uploadedDocumentsData = displayDocuments.value
      .filter((doc) => doc.status === 'success')
      .map((doc) => ({
        fileName: doc.fileName,
        url: doc.url,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
      }))

    await updateDoc(bookingDocRef, {
      uploadedDocuments: uploadedDocumentsData,
      status: 'pending_verification',
    })

    router.push({ name: 'BookingConfirmation', params: { bookingId: bookingId } })
  } catch (error) {
    console.error('Failed to update booking:', error)
    ElMessage.error('ไม่สามารถบันทึกข้อมูลการอัปโหลดได้')
  }
}

watch(
  () => userStore.isLoading,
  (loading) => {
    if (loading === false && userStore.isLoggedIn) {
      fetchExistingDocuments()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="container">
    <Process :percent="80" class="mb-5"></Process>
    <Heading
      class="mb-5"
      :head="'อัปโหลดเอกสาร'"
      :description="'กรุณาถ่ายรูปและอัปโหลดเอกสารให้ครบถ้วน'"
    ></Heading>

    <div v-if="userStore.isLoading" class="text-center p-8">
      <p>กำลังตรวจสอบเอกสารของคุณ...</p>
    </div>
    <div v-else class="space-y-4">
      <DocumentItem
        v-for="docItem in displayDocuments"
        :key="docItem.id"
        :document="docItem"
        @upload="(options) => handleUpload(options, docItem)"
        @delete="handleDelete(docItem)"
      />
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
      <el-button @click="router.go(-1)" size="large" class="w-full" style="margin-left: 0px">
        ย้อนกลับ
      </el-button>
    </div>
  </div>
</template>
