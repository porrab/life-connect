<script setup>
import Register from './views/Register.vue'
</script>

<template>
  <div>
    <router-link :to="{ name: 'Register' }">register</router-link>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
