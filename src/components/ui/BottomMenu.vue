<script setup lang="ts">
import { ref } from 'vue'
import LocationModal from './LocationModal.vue'

const emit = defineEmits(['set-location'])
const activeModal = ref<string | null>(null)

const handleSetLocation = (coords: { lat: number, lng: number }) => {
  emit('set-location', coords)
  activeModal.value = null
}
</script>

<template>
  <div class="bottom-dock-wrapper">
    <div class="dock-container">

      <button class="dock-item" :class="{ active: activeModal === 'location' }" @click="activeModal = 'location'" title="Ustaw Lokalizację">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </button>

      <button class="dock-item disabled" title="Warstwy Mapy">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 12 12 17 22 12"></polyline>
          <polyline points="2 17 12 22 22 17"></polyline>
        </svg>
      </button>

      <button class="dock-item disabled" title="Filtry Satelitów">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
      </button>

      <button class="dock-item disabled" title="Ustawienia">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

    </div>

    <Teleport to="body">
      <transition name="fade">
        <LocationModal
          v-if="activeModal === 'location'"
          @close="activeModal = null"
          @set-location="handleSetLocation"
        />
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.bottom-dock-wrapper {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
}

.dock-container {
  display: flex;
  gap: 15px;
  background: rgba(20, 20, 20, 0.85);
  padding: 10px 20px;
  border: 1px solid #444;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}

.dock-item {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid #555;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #ccc;
}

.icon {
  width: 22px;
  height: 22px;
  transition: transform 0.2s ease, stroke 0.2s ease;
}

.dock-item:hover {
  transform: translateY(-10px) scale(1.1);
  background: rgba(60, 60, 60, 1);
  border-color: #FFCC00;
  color: #FFCC00; /* Zmiana koloru linii SVG na żółty przy najechaniu */
}

.dock-item.active {
  background: #FFCC00;
  border-color: #FFCC00;
  color: #1a1a1a; /* Ciemna ikona na aktywnym, żółtym tle */
}

.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.disabled:hover {
  transform: none;
  background: rgba(40, 40, 40, 0.8);
  border-color: #555;
  color: #ccc;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .bottom-dock-wrapper { bottom: 20px; }
  .dock-item { width: 45px; height: 45px; }
  .icon { width: 20px; height: 20px; }
}
</style>
