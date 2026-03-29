<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  satellites: any[]
  trigger?: number
}>()

const emit = defineEmits(['select'])

const famousNames = ['ISS (ZARYA)', 'HST', 'TIANGONG', 'SUOMI NPP', 'AQUA']
const isMobile = ref(false)
const isMenuOpen = ref(true)

const checkScreenSize = () => {
  const mobileBreakpoint = 768
  isMobile.value = window.innerWidth <= mobileBreakpoint
  isMenuOpen.value = !isMobile.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
// ----------------------------

const topSatellites = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tick = props.trigger;
  if (!props.satellites.length) return []

  const popular = props.satellites.filter(s => famousNames.includes(s.name))
  const others = props.satellites.filter(s => !famousNames.includes(s.name))

  return [...popular, ...others].slice(0, 5)
})

const handleSelect = (sat: any) => {
  emit('select', sat)
  if (isMobile.value) {
    isMenuOpen.value = false
  }
}
</script>

<template>
  <div class="top-satellites-wrapper">
    <button
      v-if="isMobile"
      class="burger-btn"
      :class="{ 'open': isMenuOpen }"
      @click="isMenuOpen = !isMenuOpen"
      aria-label="Menu radaru"
    >
      <span class="burger-bar top"></span>
      <span class="burger-bar mid"></span>
      <span class="burger-bar bot"></span>
    </button>

    <transition name="fade">
      <div class="top-panel" v-show="isMenuOpen">
        <div class="panel-header">
          <h3>Popularne Obiekty</h3>
        </div>
        <ul class="sat-list">
          <li
            v-for="sat in topSatellites"
            :key="sat.id"
            class="sat-item"
            @click="handleSelect(sat)"
          >
            <div class="sat-info">
              <span class="sat-name">{{ sat.name }}</span>
              <span class="sat-alt">Wysokość: {{ sat.realAlt ? sat.realAlt.toFixed(0) : 0 }} km</span>
            </div>
            <span class="arrow">➔</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.top-satellites-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.burger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 44px;
  height: 44px;
  padding: 12px;

  background: rgba(20, 20, 20, 0.9);
  border: 1px solid #444;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  z-index: 21;
  transition: background-color 0.2s;
  outline: none;
}

.burger-btn:hover {
  background: rgba(40, 40, 40, 0.9);
}

.burger-bar {
  display: block;
  width: 100%;
  height: 3px;
  background-color: #E0F7FA;
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}

.burger-btn.open .top {
  transform: translateY(6.5px) rotate(45deg);
  background-color: #E0F7FA;
}

.burger-btn.open .mid {
  opacity: 0;
  transform: translateX(-10px);
}

.burger-btn.open .bot {
  transform: translateY(-8.5px) rotate(-45deg);
  background-color: #E0F7FA;
}
/* ------------------------------------------ */

.top-panel {
  width: 280px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid #444;
  border-radius: 12px;
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
  color: #E0F7FA;
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 768px) {
  .top-satellites-wrapper {
    margin-top: 5px;
    top: 15px;
    right: 15px;
  }

  .top-panel {
    width: calc(100vw - 30px);
    max-width: 320px;
    margin-top: 10px;
  }
}
</style>
