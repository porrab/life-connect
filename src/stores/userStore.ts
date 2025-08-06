// src/stores/userStore.ts

import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { type UserProfile } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // --- State ---
  const userProfile = ref<UserProfile | null>(null)
  const isLoggedIn = computed(() => !!userProfile.value)
  const isLoading = ref(true)
  const isAuthReady = ref(false)

  // --- Actions ---

  async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
    const db = getFirestore()
    const userDocRef = doc(db, 'users', uid)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      // แปลง Timestamp เป็น string 'YYYY-MM-DD'
      if (data.dateOfBirth && data.dateOfBirth instanceof Timestamp) {
        data.dateOfBirth = data.dateOfBirth.toDate().toISOString().split('T')[0]
      }
      return { uid, ...data } as UserProfile
    } else {
      console.warn('No user profile found in Firestore for UID:', uid)
      return null
    }
  }

  async function logout() {
    const auth = getAuth()
    await signOut(auth)
  }

  function listenForAuthStateChanges() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user: User | null) => {
      isLoading.value = true
      try {
        if (user) {
          const profile = await fetchUserProfile(user.uid)
          userProfile.value = profile
        } else {
          if (import.meta.env.DEV) {
            userProfile.value = {
              uid: 'dev-mode-user',
              firstName: 'นักพัฒนา',
              lastName: 'ทดสอบ',
              email: 'dev@example.com',
              dateOfBirth: '1990-01-01',
              isVerified: true,
              kycImageUrl:
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
              phoneNumber: '080-000-0000',
              nationalId: '1234567890123',
              gender: 'ชาย',
              address: '123/45 ถนนนักพัฒนา เขตโค้ดดิ้ง กรุงเทพ 10240',
            }
          } else {
            userProfile.value = null
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดระหว่างการตรวจสอบสถานะผู้ใช้:', error)
        userProfile.value = null
      } finally {
        isLoading.value = false
        if (!isAuthReady.value) {
          isAuthReady.value = true
        }
      }
    })
  }

  function waitForAuthInit(): Promise<void> {
    return new Promise((resolve) => {
      if (isAuthReady.value) {
        resolve()
      } else {
        const unwatch = watch(isAuthReady, (value) => {
          if (value) {
            unwatch()
            resolve()
          }
        })
      }
    })
  }

  function setUserAsVerified(imageUrl: string) {
    if (userProfile.value) {
      userProfile.value.isVerified = true
      userProfile.value.kycImageUrl = imageUrl
    }
  }

  return {
    userProfile,
    isLoggedIn,
    isLoading,
    isAuthReady,
    fetchUserProfile,
    setUserAsVerified,
    listenForAuthStateChanges,
    logout,
    waitForAuthInit,
  }
})
