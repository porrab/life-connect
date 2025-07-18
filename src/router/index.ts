import BenefitCard from '@/components/BenefitCard.vue'
import Benefits from '@/views/Benefits.vue'
import BookingConfirmation from '@/views/BookingConfirmation.vue'
import BookingView from '@/views/BookingView.vue'
import EventDetail from '@/views/EventDetail.vue'
import EventPreRegister from '@/views/EventPreRegister.vue'
import Home from '@/views/Home.vue'
import Kyc from '@/views/Kyc.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
import UploadDocuments from '@/views/UploadDocuments.vue'
import Booking from '@/views/ฺBooking.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/kyc', name: 'Kyc', component: Kyc, meta: { requiresAuth: true } },
    {
      path: '/booking',
      name: 'Booking',
      component: Booking,
    },
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
      name: 'Booking',
      component: BookingView,
      props: true,
      meta: { requiresAuth: true },
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
  ],
})

export default router
