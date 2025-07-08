import Home from '@/views/Home.vue'
import Kyc from '@/views/Kyc.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
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
  ],
})

export default router
