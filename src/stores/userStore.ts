import { getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type UserProfile = {
  firstName: string
  lastName: string
  email: string
}
export const useUserStore = defineStore('user', () => {
  const userProfile = ref<UserProfile | null>(null)
  const isLoggedIn = ref(false)

  async function fetchUserProfile() {
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      isLoggedIn.value = true
      const db = getFirestore()
      const userDocRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        userProfile.value = docSnap.data() as UserProfile
      } else {
        console.log('No user in db')
      }
    } else {
      isLoggedIn.value = false
      userProfile.value = null
    }
  }
  return { userProfile, isLoggedIn, fetchUserProfile }
})
