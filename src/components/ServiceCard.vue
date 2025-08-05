<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title: string
  iconSrc: string
  description: string
  link?: string | object
}>()
const router = useRouter()

const handleCardClick = () => {
  if (!props.link) return
  if (typeof props.link === 'string') {
    window.open(props.link, '_blank')
  } else {
    router.push(props.link)
  }
}
</script>

<template>
  <div
    @click="handleCardClick"
    class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center transition-transform transform hover:-translate-y-1 border border-gray-100"
    :class="{ 'cursor-pointer': link, 'cursor-default': !link }"
  >
    <div class="mb-3">
      <img :src="iconSrc" alt="" class="w-12 h-12" />
    </div>
    <span class="font-semibold text-gray-800 text-sm">{{ title }}</span>
    <p class="text-xs text-gray-500 mt-1">{{ description }}</p>
  </div>
</template>

<style scoped></style>
