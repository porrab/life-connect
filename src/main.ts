import './assets/main.css'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VCalender from 'v-calendar'
import 'v-calendar/style.css'
import App from './App.vue'
import router from './router'
import '@/firebase.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VCalender, {})
app.mount('#app')
