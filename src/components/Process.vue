<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  percent: number
}>()

const progressBar_style = computed(() => {
  return {
    width: `${props.percent}%`,
  }
})
</script>

<template>
  <div class="flex items-center justify-between mb-6 px-4">
    <div class="text-blue-600 font-bold">เริ่มต้น</div>
    <div class="flex-grow h-1 bg-gray-200 mx-4 rounded-full relative">
      <div
        class="absolute top-0 left-0 h-1 bg-blue-600 rounded-full"
        :style="progressBar_style"
      ></div>
    </div>
    <div class="text-gray-400">สิ้นสุด</div>
  </div>
</template>

<style scoped></style>
