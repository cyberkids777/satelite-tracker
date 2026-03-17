<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SatellitePanel from './ui/SatelitePanel.vue'
import GlobeScene from './GlobeScene.vue'

// --- STANY ---
const status = ref('Inicjalizacja systemu...')
const hasError = ref(false)
const selectedSat = ref<any>(null)

// Dane dla komponentu 3D
const currentPoint = ref<any>(null)
const history = ref<any[]>([])

const API_KEY = import.meta.env.VITE_N2YO_API_KEY
const NORAD_ID = 25544 // ISS
const SECONDS = 300
const TRAIL_LENGTH = 100

let trajectory: any[] = []
let currentIndex = 0

// --- LOGIKA API ---
const startTracking = async () => {
  try {
    status.value = 'Pobieranie telemetrii...'
    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/${NORAD_ID}/0/0/0/${SECONDS}/&apiKey=${API_KEY}`
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`

    const response = await fetch(proxyUrl)
    const data = await response.json()

    if (!data.positions) throw new Error('API nie zwróciło danych.')

    trajectory = data.positions.map((pos: any) => ({
      name: data.info.satname || 'Nieznany obiekt',
      id: NORAD_ID,
      lat: pos.satlatitude || 0,
      lng: pos.satlongitude || 0,
      alt: (pos.sataltitude || 0) / 6371,
      realAlt: pos.sataltitude || 0,
      azimuth: pos.azimuth || 0,
      timestamp: new Date(pos.timestamp * 1000).toLocaleTimeString()
    }))

    status.value = 'Śledzenie i zapisywanie trasy'
    hasError.value = false

    // Główna pętla czasowa
    setInterval(() => {
      if (currentIndex < trajectory.length) {
        const point = trajectory[currentIndex]

        currentPoint.value = point // Przekazanie do 3D
        history.value.push(point)  // Przekazanie historii do 3D

        if (history.value.length > TRAIL_LENGTH) {
          history.value.shift()
        }

        // Aktualizacja otwartego panelu bocznego
        if (selectedSat.value && selectedSat.value.id === point.id) {
          selectedSat.value = point
        }

        currentIndex++
      } else {
        status.value = 'Trasa zakończona. Odśwież stronę.'
      }
    }, 1000)

  } catch (error) {
    console.error(error)
    status.value = 'Błąd pobierania danych.'
    hasError.value = true
  }
}

onMounted(() => {
  startTracking()
})

// Obsługa eventów z dzieci
const handleSatelliteClick = (sat: any) => {
  selectedSat.value = sat
}
const closePanel = () => {
  selectedSat.value = null
}
</script>

<template>
  <div class="tracker-container">
    <div class="top-status">
      <p :class="{ 'error-text': hasError, 'success-text': !hasError }">
        {{ status }}
      </p>
    </div>

    <transition name="slide">
      <SatellitePanel
        v-if="selectedSat"
        :satellite="selectedSat"
        @close="closePanel"
      />
    </transition>

    <GlobeScene
      :current-point="currentPoint"
      :history="history"
      @satellite-click="handleSatelliteClick"
    />
  </div>
</template>

<style scoped>
.tracker-container { position: relative; width: 100vw; height: 100vh; }
.top-status { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10; background: rgba(15, 15, 15, 0.85); padding: 10px 25px; border-radius: 30px; border: 1px solid #333; font-family: sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5); pointer-events: none; }
.success-text { color: #4CAF50; font-weight: bold; margin: 0; }
.error-text { color: #f44336; font-weight: bold; margin: 0; }

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-50px); }
</style>
