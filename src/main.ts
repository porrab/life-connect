import './assets/main.css'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VCalender from 'v-calendar'
import 'v-calendar/style.css'
import App from './App.vue'
import router from './router'
import '@/firebase.ts'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/userStore'
import '@/firebase'

let app: any = null

onAuthStateChanged(getAuth(), async (user) => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VCalender, {})

    await router.isReady()
    app.mount('#app')
  }

  const userStore = useUserStore()
  if (user) {
    if (!userStore.userProfile) {
      console.log('User detected, fetching profile...')
      await userStore.fetchUserProfile()
    }
  } else {
    userStore.userProfile = null
    userStore.isLoggedIn = false
  }
})
