<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title: string
  iconSrc: string
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
    class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center transition-transform transform hover:-translate-y-1"
    :class="{ 'cursor-pointer': link, 'cursor-default': !link }"
  >
    <img :src="iconSrc" alt="" class="w-12 h-12 mb-2" />
    <span class="font-semibold text-gray-700 text-sm">{{ title }}</span>
  </div>
</template>

<style scoped></style>
