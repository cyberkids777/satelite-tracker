<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from 'vue'

const props = defineProps<{
  satellites: any[]
  trigger?: number
}>()

defineEmits(['select'])

// Definiujemy znane obiekty, które chcemy wyciągnąć na szczyt listy
const famousNames = ['ISS (ZARYA)', 'HST', 'TIANGONG', 'SUOMI NPP', 'AQUA']

const topSatellites = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tick = props.trigger;

  if (!props.satellites.length) return []

  // Szukamy najpopularniejszych
  const popular = props.satellites.filter(s => famousNames.includes(s.name))
  // Dobieramy resztę, żeby zawsze było ich dokładnie 5
  const others = props.satellites.filter(s => !famousNames.includes(s.name))

  return [...popular, ...others].slice(0, 5)
})
</script>

<template>
  <div class="top-panel">
    <div class="panel-header">
      <h3>Popularne Obiekty</h3>
    </div>
    <ul class="sat-list">
      <li
        v-for="sat in topSatellites"
        :key="sat.id"
        class="sat-item"
        @click="$emit('select', sat)"
      >
        <div class="sat-info">
          <span class="sat-name">{{ sat.name }}</span>
          <span class="sat-alt">Wysokość: {{ sat.realAlt ? sat.realAlt.toFixed(0) : 0 }} km</span>
        </div>
        <span class="arrow">➔</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.top-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid #444;
  border-radius: 12px;
  z-index: 20;
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
  overflow: hidden;
}

.panel-header {
  background: #1a1a1a;
  padding: 12px 20px;
  border-bottom: 1px solid #333;
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #FFCC00;
}

.sat-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sat-item:last-child {
  border-bottom: none;
}

.sat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sat-info {
  display: flex;
  flex-direction: column;
}

.sat-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #E0F7FA;
  margin-bottom: 4px;
}

.sat-alt {
  font-size: 0.8rem;
  color: #aaa;
}

.arrow {
  color: #666;
  font-size: 1.1rem;
  transition: color 0.2s, transform 0.2s;
}

.sat-item:hover .arrow {
  color: #FFCC00;
  transform: translateX(3px);
}
</style>
