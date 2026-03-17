<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
defineProps<{
  satellite: any
}>()

defineEmits(['close'])
</script>

<template>
  <div class="side-panel">
    <div class="panel-header">
      <h2>{{ satellite.name }}</h2>
      <button @click="$emit('close')" class="close-btn">✖</button>
    </div>

    <div class="panel-content">
      <div class="data-row"><span class="label">ID NORAD:</span><span class="value">{{ satellite.id }}</span></div>
      <div class="data-row"><span class="label">Wysokość:</span><span class="value">{{ satellite.realAlt.toFixed(2) }} km</span></div>
      <div class="data-row"><span class="label">Szerokość Geog.:</span><span class="value">{{ satellite.lat.toFixed(4) }}°</span></div>
      <div class="data-row"><span class="label">Długość Geog.:</span><span class="value">{{ satellite.lng.toFixed(4) }}°</span></div>
      <div class="data-row"><span class="label">Prędkość:</span><span class="value highlight">{{ satellite.speed.toFixed(0) }} km/h</span></div>
      <div class="data-row"><span class="label">Ostatni odczyt:</span><span class="value">{{ satellite.timestamp }}</span></div>
    </div>
  </div>
</template>

<style scoped>
.side-panel {
  position: absolute;
  top: 20px; left: 20px; width: 320px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid #444; border-radius: 12px;
  z-index: 20; font-family: 'Segoe UI', sans-serif; color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8); backdrop-filter: blur(5px);
  overflow: hidden;
}
.panel-header { display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 15px 20px; border-bottom: 1px solid #333; }
.panel-header h2 { margin: 0; font-size: 1.2rem; color: #4CAF50; }
.close-btn { background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
.close-btn:hover { color: #fff; }
.panel-content { padding: 20px; }
.data-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; }
.data-row:last-child { margin-bottom: 0; }
.label { color: #aaa; }
.value { font-weight: 600; text-align: right; }
.highlight { color: #ffb74d; }
</style>
