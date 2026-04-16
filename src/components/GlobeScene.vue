<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted } from 'vue'
import Globe from 'globe.gl'

const emit = defineEmits(['satellite-click'])
const globeContainer = ref<HTMLElement | null>(null)
let globe: any = null

const updateSatellites = (satellites: any[]) => {
  if (globe) {
    globe.htmlElementsData(satellites)
  }
}

const updatePaths = (paths: any[]) => {
  if (globe) {
    globe.pathsData(paths)
  }
}

const focusOn = (lat: number, lng: number, satAltitude: number) => {
  if (globe) {
    const cameraAlt = satAltitude + 1.2;
    globe.pointOfView({ lat, lng, altitude: cameraAlt }, 1200);
  }
}

const updateUserLocation = (location: { lat: number, lng: number } | null) => {
  if (globe) {
    globe.ringsData(location ? [location] : [])
  }
}

defineExpose({ updateSatellites, updatePaths, focusOn, updateUserLocation })

onMounted(() => {
  if (!globeContainer.value) return

  const GlobeAny = Globe as any
  globe = GlobeAny()(globeContainer.value)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')

    .pathPoints('points')
    .pathPointLat((p: any) => p.lat)
    .pathPointLng((p: any) => p.lng)
    .pathPointAlt((p: any) => p.alt)
    .pathStroke(2.5)
    .pathResolution(3)
    .pathTransitionDuration(0)

    .pathColor((d: any) => d.isFuture
      ? ['rgba(255, 204, 0, 0.9)', 'rgba(255, 204, 0, 0)']
      : ['rgba(135, 206, 250, 0)', 'rgba(135, 206, 250, 0.9)']
    )

    .pathDashLength((d: any) => d.isFuture ? 0.1 : 1)
    .pathDashGap((d: any) => d.isFuture ? 0.05 : 0)

    .htmlElement((d: any) => {
      const el = document.createElement('div');
      el.innerHTML = `${d.name}`;
      el.style.color = '#E0F7FA';
      el.style.fontSize = '12px';
      el.style.fontWeight = '600';
      el.style.textShadow = '2px 2px 4px rgba(0,0,0,0.9)';
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
      el.style.whiteSpace = 'nowrap';
      el.onclick = () => emit('satellite-click', d);
      return el;
    })
    .htmlLat('lat')
    .htmlLng('lng')
    .htmlAltitude('alt')
    .htmlTransitionDuration(1000)

  globe.controls().autoRotate = false
})
</script>

<template>
  <div ref="globeContainer" class="globe-wrapper"></div>
</template>

<style scoped>
.globe-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  cursor: crosshair;
}
</style>
