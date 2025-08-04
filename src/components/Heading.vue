<script setup lang="ts">
const props = defineProps<{
  head: string
  description: string
}>()
</script>

<template>
  <div class="text-center mb-5">
    <h1 class="text-2xl font-bold text-gray-800">
      <slot name="head">{{ head || 'Head' }}</slot>
    </h1>
    <p class="text-sm text-gray-500">
      <slot name="description">{{ description || 'description' }}</slot>
    </p>
  </div>
</template>

<style scoped></style>
