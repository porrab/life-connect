<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const userStore = useUserStore()
</script>

<template>
  <div v-if="userStore.isAuthReady" class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow bg-gray-50">
      <RouterView />
    </main>
    <Footer />
  </div>

  <div v-else class="flex justify-center items-center min-h-screen bg-gray-50">
    <div class="text-center">
      <img src="@/assets/icon.png" alt="Live Connect Logo" class="h-12 w-auto mx-auto mb-4" />
      <p class="text-gray-500">กำลังโหลด...</p>
    </div>
  </div>
</template>

<style scoped></style>
