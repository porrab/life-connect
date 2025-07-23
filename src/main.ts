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
const app = createApp(App)

app.use(createPinia())
const userStore = useUserStore()
app.use(router)
app.use(VCalender, {})

userStore.initializeUser().then(() => {
  app.mount('#app')
})
