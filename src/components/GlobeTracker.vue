<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Globe from 'globe.gl'

// Referencja do kontenera div, w którym wyrenderuje się canvas 3D
const globeContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!globeContainer.value) return

  // Inicjalizacja Globe.gl
  const world = new Globe()(globeContainer.value)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')

  // Lekki auto-obrót planety
  world.controls().autoRotate = true
  world.controls().autoRotateSpeed = 0.5
})
</script>

<template>
  <div ref="globeContainer" class="globe-wrapper"></div>
</template>

<style scoped>
.globe-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}
</style>
