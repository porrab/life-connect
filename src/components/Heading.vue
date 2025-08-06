<script setup lang="ts">
const props = defineProps<{
  head: string
  description?: string
}>()
</script>

<template>
  <div class="text-center mb-5">
    <h1 class="text-2xl font-bold">
      <slot name="head">{{ head || 'Head' }}</slot>
    </h1>
    <p class="text-sm text-gray-500">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>
</template>

<style scoped>
h1,
p {
  color: #466baf;
}
</style>
