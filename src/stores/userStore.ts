import { getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type UserProfile } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const userProfile = ref<UserProfile | null>(null)
  const isLoggedIn = ref(false)

  async function fetchUserProfile(): Promise<void> {
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      isLoggedIn.value = true
      const db = getFirestore()
      const userDocRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

        if (data.dateOfBirth && data.dateOfBirth instanceof Timestamp) {
          const date = data.dateOfBirth.toDate()
          const year = date.getFullYear()
          const month = ('0' + (date.getMonth() + 1)).slice(-2)
          const day = ('0' + date.getDate()).slice(-2)
          data.dateOfBirth = `${year}-${month}-${day}`
        }

        userProfile.value = { uid: user.uid, ...data } as UserProfile
      } else {
        console.log('No user profile found in Firestore for UID:', user.uid)
        userProfile.value = null
      }
    } else {
      isLoggedIn.value = false
      userProfile.value = null
      if (import.meta.env.DEV) {
        userProfile.value = {
          uid: 'dev-1',
          firstName: 'ห่าน (ทดสอบ)',
          lastName: 'รักดี',
          email: 'test@example.com',
          dateOfBirth: '1960-01-01',
          isVerified: false,
          kycImageUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          phoneNumber: '1234567890',
          nationalId: '1234567890123',
          gender: 'ชาย',
          address: 'asd',
        }
        isLoggedIn.value = true
      }
    }
  }

  function setUserAsVerified(imageUrl: string) {
    if (userProfile.value) {
      userProfile.value.isVerified = true
      userProfile.value.kycImageUrl = imageUrl
    }
  }

  return { userProfile, isLoggedIn, fetchUserProfile, setUserAsVerified }
})
