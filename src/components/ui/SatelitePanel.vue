<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '../../composables/useAuth'
import { useBookmarks } from '../../composables/useBookmarks'

const props = defineProps<{
  satellite: any
}>()

defineEmits(['close'])

const { user } = useAuth()
const { isBookmarked, toggleBookmark } = useBookmarks()

const handleBookmarkClick = () => {
  if (user.value && props.satellite) {
    toggleBookmark( user.value.id, props.satellite )
  }
}
</script>

<template>
  <div class="side-panel">
    <div class="panel-header">
      <h2>{{ satellite.name }}</h2>
      <div class="header-actions">
        <button
          v-if="user"
          @click="handleBookmarkClick"
          class="bookmark-btn"
          :class="{ active: isBookmarked(satellite.id.toString()) }"
          :title="isBookmarked(satellite.id.toString()) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isBookmarked(satellite.id.toString()) ? '#FFCC00' : 'none'" :stroke="isBookmarked(satellite.id.toString()) ? '#FFCC00' : '#888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
        <button @click="$emit('close')" class="close-btn">✖</button>
      </div>
    </div>

    <div class="panel-content">

      <div class="data-row">
        <span class="label">ID NORAD:</span>
        <span class="value">
          <a
            :href="`https://www.n2yo.com/satellite/?s=${satellite.id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="value"
            title="Zobacz szczegóły na N2YO"
          >
            {{ satellite.id }} <span class="external-icon">↗</span>
          </a>
        </span>
      </div>

      <div class="data-row"><span class="label">Wysokość:</span><span class="value">{{ satellite.realAlt.toFixed(2) }} km</span></div>
      <div class="data-row"><span class="label">Szerokość Geog.:</span><span class="value">{{ satellite.lat.toFixed(4) }}°</span></div>
      <div class="data-row"><span class="label">Długość Geog.:</span><span class="value">{{ satellite.lng.toFixed(4) }}°</span></div>
      <div class="data-row"><span class="label">Prędkość:</span><span class="value">{{ satellite.speed.toFixed(0) }} km/h</span></div>
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

.value a { color: inherit; }
.panel-header { display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 15px 20px; border-bottom: 1px solid #333; }
.panel-header h2 { margin: 0; font-size: 1.2rem;}
.close-btn { background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
.close-btn:hover { color: #fff; }
.panel-content { padding: 20px; }
.data-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; }
.data-row:last-child { margin-bottom: 0; }
.label { color: #aaa; }
.value { font-weight: 600; text-align: right; }

.header-actions { display: flex; align-items: center; gap: 10px; }
.bookmark-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; outline: none; }
.bookmark-btn:hover { transform: scale(1.15); }
.bookmark-btn:hover svg { stroke: #FFCC00; }

@media (max-width: 768px) {
  .side-panel {
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 20px 20px 0 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
    max-height: 45vh;
    overflow-y: auto;
    padding-bottom: 30px;
  }
}
</style>
