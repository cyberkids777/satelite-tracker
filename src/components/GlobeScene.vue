<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Globe from 'globe.gl'

const props = defineProps<{
  satellites: any[]
  history: any[]
}>()

const emit = defineEmits(['satellite-click'])

const globeContainer = ref<HTMLElement | null>(null)
let globe: any = null

onMounted(() => {
  if (!globeContainer.value) return

  globe = new Globe()(globeContainer.value)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')

    // Ogon (Tylko dla aktualnie klikniętego satelity!)
    .pathPoints('points')
    .pathPointLat(p => p.lat)
    .pathPointLng(p => p.lng)
    .pathPointAlt(p => p.alt)
    .pathColor(() => ['rgba(135, 206, 250, 0)', 'rgba(135, 206, 250, 0.9)'])
    .pathStroke(2.5)
    .pathResolution(3)
    .pathTransitionDuration(0)

    // Etykiety (Armada Satelitów)
    .labelLat('lat')
    .labelLng('lng')
    .labelAltitude('alt')
    .labelText(d => d.name)
    .labelSize(0.6) // Zmniejszona czcionka dla większej ilości obiektów
    .labelDotRadius(0.3)
    .labelDotOrientation(() => 'right')
    .labelColor(() => '#E0F7FA')
    .labelResolution(2)
    .labelsTransitionDuration(0)
    .onLabelClick((d) => emit('satellite-click', d))

  globe.controls().autoRotate = false
})

// Obserwujemy całą tablicę satelitów
watch(() => props.satellites, (newVal) => {
  if (globe) globe.labelsData(newVal)
})

watch(() => props.history, (newVal) => {
  // Rysuj ogon, tylko jeśli ma minimum 2 punkty, w przeciwnym razie wyczyść (pusta tablica [])
  if (globe) globe.pathsData(newVal.length >= 2 ? [{ points: newVal }] : [])
})
</script>

<template>
  <div ref="globeContainer" class="globe-wrapper"></div>
</template>

<style scoped>
.globe-wrapper { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; cursor: crosshair; }
</style>
