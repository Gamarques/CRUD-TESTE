<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  type: { type: String, default: 'error' }
})

const visible = ref(false)

watch(
  () => props.message,
  (msg) => {
    if (msg) {
      visible.value = true
      setTimeout(() => (visible.value = false), 3500)
    }
  }
)
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible && message"
      :class="[
        'fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-md text-sm z-50',
        type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
      ]"
    >
      {{ message }}
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
