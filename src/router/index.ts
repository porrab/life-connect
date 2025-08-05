import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
// เราจะ import แค่ Home มาก่อน เพราะเป็นหน้าแรก
import Home from '@/views/Home.vue'

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
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/kyc',
      name: 'Kyc',
      component: () => import('@/views/KycView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/benefits',
      name: 'Benefits',
      component: () => import('@/views/Benefits.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/event/pre-register/:id',
      name: 'EventPreRegister',
      component: () => import('@/views/EventPreRegister.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/event/:id',
      name: 'EventDetail',
      component: () => import('@/views/EventDetail.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/booking/:serviceId',
      name: 'BookingService',
      component: () => import('@/views/BookingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/upload-documents/:bookingId',
      name: 'UploadDocuments',
      component: () => import('@/views/UploadDocuments.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/booking-confirmation/:bookingId',
      name: 'BookingConfirmation',
      component: () => import('@/views/BookingConfirmation.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/e-doc',
      name: 'Edoc',
      component: () => import('@/views/EdocView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/kyc-history',
      name: 'KycHistory',
      component: () => import('@/views/KycHistoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/security-notification',
      name: 'SecurityNotification',
      component: () => import('@/views/SecurityNotification.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isAuthReady) {
    await userStore.waitForAuthInit()
  }

  const requiresAuth = to.meta.requiresAuth
  const isLoggedIn = userStore.isLoggedIn

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
