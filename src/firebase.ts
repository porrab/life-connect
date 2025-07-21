// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDUICqTwpUB7DZ7REGkhcyzTojrcRI11pg',
  authDomain: 'live-connect-fa8ad.firebaseapp.com',
  projectId: 'live-connect-fa8ad',
  storageBucket: 'live-connect-fa8ad.firebasestorage.app',
  messagingSenderId: '467590631373',
  appId: '1:467590631373:web:fb224416e9ab9233d9fe84',
  measurementId: 'G-SSNG9B7DE8',
}

const app = initializeApp(firebaseConfig)

// Initialize Firebase services and export them
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
export { auth, db }
