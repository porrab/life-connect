<script setup>
defineProps({
  title: String,
  iconSrc: String,
})
</script>

<template>
  <div
    class="bg-white p-4 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:shadow-xl transition-shadow"
  >
    <img :src="iconSrc" class="w-8 h-8" alt="" />
    <span class="font-semibold text-gray-700">{{ title }}</span>
  </div>
</template>

<style scoped></style>
