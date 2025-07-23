import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getAuth } from 'firebase/auth'
import EdocView from '@/views/EdocView.vue'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Benefits from '@/views/Benefits.vue'
import EventPreRegister from '@/views/EventPreRegister.vue'
import EventDetail from '@/views/EventDetail.vue'
import UploadDocuments from '@/views/UploadDocuments.vue'
import BookingConfirmation from '@/views/BookingConfirmation.vue'
import KycView from '@/views/KycView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/kyc', name: 'Kyc', component: KycView, meta: { requiresAuth: true } },
    {
      path: '/benefits',
      name: 'Benefits',
      component: Benefits,
      meta: { requiresAuth: true },
    },
    {
      path: '/event/pre-register/:id',
      name: 'EventPreRegister',
      component: EventPreRegister,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/event/:id',
      name: 'EventDetail',
      component: EventDetail,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/booking/:serviceId',
      name: 'BookingService',
      component: () => import('@/views/BookingView.vue'),
      meta: { requiresAuth: true },

      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const auth = getAuth()
        const currentUser = auth.currentUser

        if (currentUser && !userStore.userProfile) {
          console.log('Fetching user profile before entering route...')
          await userStore.initializeUser()
        }
        next()
      },
    },
    {
      path: '/upload-documents/:bookingId',
      name: 'UploadDocuments',
      component: UploadDocuments,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/booking-confirmation/:bookingId',
      name: 'BookingConfirmation',
      component: BookingConfirmation,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/e-doc',
      name: 'Edoc',
      component: EdocView,
      meta: { requiresAuth: true },
    },
  ],
})

export default router
