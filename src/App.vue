<script setup lang="ts">
import GlobeTracker from './components/GlobeTracker.vue'
</script>

<template>
  <GlobeTracker />
</template>

<style>
/* Resetujemy domyślne marginesy przeglądarki, żeby kosmos zajął cały ekran */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  padding: 0;
  max-width: none;
}
</style>
