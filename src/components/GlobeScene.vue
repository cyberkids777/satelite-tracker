<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Globe from 'globe.gl'

const props = defineProps<{
  currentPoint: any | null
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

    // Ogon (Z rozdzielczością 3 i pocienieniem, jak prosiłeś)
    .pathPoints('points')
    .pathPointLat(p => p.lat)
    .pathPointLng(p => p.lng)
    .pathPointAlt(p => p.alt)
    .pathColor(() => ['rgba(135, 206, 250, 0)', 'rgba(135, 206, 250, 0.9)'])
    .pathStroke(2.5)
    .pathResolution(3)
    .pathTransitionDuration(0)

    // Etykieta
    .labelLat('lat')
    .labelLng('lng')
    .labelAltitude('alt')
    .labelText(d => d.name)
    .labelSize(0.9)
    .labelDotRadius(0.3)
    .labelDotOrientation(() => 'right')
    .labelColor(() => '#E0F7FA')
    .labelResolution(2)
    .labelsTransitionDuration(0)
    .onLabelClick((d) => emit('satellite-click', d)) // Wypuszczamy event w górę!

  globe.controls().autoRotate = false
})

// Reagowanie na zmiany z góry (od rodzica) i wtłaczanie ich do WebGL
watch(() => props.currentPoint, (newVal) => {
  if (globe && newVal) globe.labelsData([newVal])
}, { deep: true })

watch(() => props.history, (newVal) => {
  if (globe && newVal.length >= 2) globe.pathsData([{ points: newVal }])
}, { deep: true })
</script>

<template>
  <div ref="globeContainer" class="globe-wrapper"></div>
</template>

<style scoped>
.globe-wrapper { width: 100vw; height: 100vh; overflow: hidden; background-color: #000; cursor: crosshair; }
</style>
