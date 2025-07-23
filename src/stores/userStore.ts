import { getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type UserProfile } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const userProfile = ref<UserProfile | null>(null)
  const isLoggedIn = ref(false)
  const isLoading = ref(true)

  async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
    const db = getFirestore()
    const userDocRef = doc(db, 'users', uid)
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
      return { uid, ...data } as UserProfile
    } else {
      console.log('No user profile found in Firestore for UID:', uid)
      return null
    }
  }

  async function initializeUser() {
    isLoading.value = true
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      const profile = await fetchUserProfile(user.uid)
      userProfile.value = profile
      isLoggedIn.value = !!profile
    } else {
      if (import.meta.env.DEV) {
        userProfile.value = {
          uid: 'dev-1',
          firstName: 'ห่านlnwza',
          lastName: 'วงศ์ดี',
          email: 'test@example.com',
          dateOfBirth: '1966-07-15',
          isVerified: true,
          kycImageUrl: 'https://i.pravatar.cc/150?u=somchai',
          phoneNumber: '0812345678',
          nationalId: '1123456789012',
          gender: 'ชาย',
          address: '123/45 ซอยสุขุมวิท 21 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
        }
        isLoggedIn.value = true
      } else {
        userProfile.value = null
        isLoggedIn.value = false
      }
    }
    isLoading.value = false
  }

  function setUserAsVerified(imageUrl: string) {
    if (userProfile.value) {
      userProfile.value.isVerified = true
      userProfile.value.kycImageUrl = imageUrl
    }
  }

  return { userProfile, isLoggedIn, isLoading, fetchUserProfile, setUserAsVerified, initializeUser }
})
