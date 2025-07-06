<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useUserStore } from './stores/userStore'
import { onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const userStore = useUserStore()

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    userStore.fetchUserProfile()
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar></Navbar>

    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<style scoped></style>
