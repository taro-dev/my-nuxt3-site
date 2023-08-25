<template>
  <div
    id="app"
    ref="container"
    class="absolute flex flex-col h-screen justify-between"
  >
    <main class="z-10 max-w-4xl mx-auto mb-auto px-4 py-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
const container: Ref<HTMLElement | null> = ref(null)
const { clientWidth, clientHeight } = useWindowSize()
onMounted(() => {
  if (!container) {
    return
  }
  const { init, animate } = useBox(container, clientWidth, clientHeight)
  init()
  animate()
})
</script>

<style>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
