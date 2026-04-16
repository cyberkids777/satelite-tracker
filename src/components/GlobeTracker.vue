<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onUnmounted } from 'vue'
import * as satellite from 'satellite.js'
import SatellitePanel from './ui/SatelitePanel.vue'
import TopSatellitesPanel from './ui/TopSatellitesPanel.vue'
import GlobeScene from './GlobeScene.vue'

const status = ref('Inicjalizacja systemu...')
const hasError = ref(false)
const selectedSat = ref<any>(null)
const uiTrigger = ref(0)

// Referencja do komponentu 3D, pozwalająca na bezpośrednie wstrzykiwanie danych
const globeSceneRef = ref<any>(null)

let rawSatellites: any[] = []
let rawPaths: any[] = []
let animationInterval: number

const startTracking = async () => {
  try {
    let text = ''

    const CACHE_KEY = 'celestrak_data'
    const CACHE_TIME_KEY = 'celestrak_timestamp'
    const CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 godziny w milisekundach

    const cachedData = localStorage.getItem(CACHE_KEY)
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY)
    const now = Date.now()

    if (cachedData && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
      status.value = 'Wczytywanie bazy z pamięci podręcznej (Cache)'
      text = cachedData
    } else {
      status.value = 'Pobieranie nowej bazy z CelesTrak'
      const url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle'
      const response = await fetch(url)

      if (!response.ok) throw new Error(`Błąd HTTP: ${response.status}`)
      text = await response.text()

      if (text.trim().startsWith('<')) {
        throw new Error('API zwróciło stronę HTML. Prawdopodobnie blokada (Ban).')
      }

      localStorage.setItem(CACHE_KEY, text)
      localStorage.setItem(CACHE_TIME_KEY, now.toString())
    }

    const lines = text.split('\n').map(l => l.trim())
    for (let i = 0; i < lines.length; i += 3) {

      if (rawSatellites.length >= 150) break;

      const name = lines[i]
      const tle1 = lines[i + 1]
      const tle2 = lines[i + 2]

      if (name && tle1 && tle2 && tle1.startsWith('1 ') && tle2.startsWith('2 ')) {
        try {
          const satrec = satellite.twoline2satrec(tle1, tle2)
          rawSatellites.push({
            id: satrec.satnum,
            name: name,
            satrec: satrec,
            lat: 0, lng: 0, alt: 0, realAlt: 0, speed: 0, timestamp: ''
          })
        } catch { }
      }
    }

    status.value = `Radar aktywny: Śledzenie ${rawSatellites.length} obiektów.`
    hasError.value = false

    // Pierwsze wyliczenie i start pętli
    calculatePositions()
    animationInterval = window.setInterval(calculatePositions, 1000)

  } catch (error) {
    console.error(error)
    status.value = 'Błąd pobierania bazy TLE. Spróbuj ponownie później.'
    hasError.value = true
  }
}

const calculatePositions = () => {
  const now = new Date()
  const gmst = satellite.gstime(now)

  // Aktualizujemy pozycje starych obiektów
  rawSatellites.forEach(sat => {
    const positionAndVelocity = satellite.propagate(sat.satrec, now)
    if (!positionAndVelocity) return

    const positionEci = positionAndVelocity.position
    const velocity = positionAndVelocity.velocity

    if (positionEci && velocity) {
      const positionGd = satellite.eciToGeodetic(positionEci as any, gmst)
      const lat = satellite.degreesLat(positionGd.latitude)
      const lng = satellite.degreesLong(positionGd.longitude)
      const alt = positionGd.height / 6371
      const speedKmS = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2) + Math.pow(velocity.z, 2))

      if (isNaN(lat) || isNaN(lng) || isNaN(alt)) return

      sat.lat = lat
      sat.lng = lng
      sat.alt = alt
      sat.realAlt = positionGd.height
      sat.speed = speedKmS * 3600
      sat.timestamp = now.toLocaleTimeString()
    }
  })

  if (globeSceneRef.value) {
    globeSceneRef.value.updateSatellites(rawSatellites)
  }

  // Odświeżenie danych w panelu lewym
  if (selectedSat.value) {
    const updatedSat = rawSatellites.find(s => s.id === selectedSat.value.id)
    if (updatedSat) {
      selectedSat.value = { ...updatedSat }
    }
  }

  uiTrigger.value++
}

const buildHistoryTrail = (sat: any) => {
  if (!sat || !sat.satrec) return
  const now = new Date()
  const pastPositions = []
  const futurePositions = []

  const getPositionAt = (minutesOffset: number) => {
    const targetDate = new Date(now.getTime() + minutesOffset * 60000)
    const positionAndVelocity = satellite.propagate(sat.satrec, targetDate)
    if (!positionAndVelocity) return null

    const positionEci = positionAndVelocity.position
    if (positionEci) {
      const gmst = satellite.gstime(targetDate)
      const positionGd = satellite.eciToGeodetic(positionEci as any, gmst)
      const lat = satellite.degreesLat(positionGd.latitude)
      const lng = satellite.degreesLong(positionGd.longitude)
      const alt = positionGd.height / 6371

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(alt)) {
        return { lat, lng, alt }
      }
    }
    return null
  }

  for (let i = -90; i <= 0; i++) {
    const pos = getPositionAt(i)
    if (pos) pastPositions.push(pos)
  }

  for (let i = 0; i <= 15; i++) {
    const pos = getPositionAt(i)
    if (pos) futurePositions.push(pos)
  }

  rawPaths = []
  if (pastPositions.length > 1) {
    rawPaths.push({ points: pastPositions, isFuture: false })
  }
  if (futurePositions.length > 1) {
    rawPaths.push({ points: futurePositions, isFuture: true })
  }

  if (globeSceneRef.value) {
    globeSceneRef.value.updatePaths(rawPaths)
  }
}

onMounted(() => {
  startTracking()
})

onUnmounted(() => {
  clearInterval(animationInterval)
})

const handleSatelliteClick = (sat: any) => {
  selectedSat.value = sat
  buildHistoryTrail(sat)

  if (globeSceneRef.value && sat.lat !== undefined && sat.lng !== undefined) {
    globeSceneRef.value.focusOn(sat.lat, sat.lng, sat.alt)
  }
}

const closePanel = () => {
  selectedSat.value = null
  rawPaths = []

  if (globeSceneRef.value) {
    globeSceneRef.value.updateHistory(rawPaths)
  }
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

    <transition name="slide-right">
      <TopSatellitesPanel
        v-if="uiTrigger > 0"
        :satellites="rawSatellites"
        :trigger="uiTrigger"
        @select="handleSatelliteClick"
      />
    </transition>

    <GlobeScene
      ref="globeSceneRef"
      @satellite-click="handleSatelliteClick"
    />
  </div>
</template>

<style scoped>
.tracker-container { position: relative; width: 100vw; height: 100dvh; }
.top-status { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10; background: rgba(15, 15, 15, 0.85); padding: 10px 25px; border-radius: 30px; border: 1px solid #333; font-family: sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5); pointer-events: none; }
.success-text { color:#E0F7FA; font-weight: bold; margin: 0; }
.error-text { color: #f44336; font-weight: bold; margin: 0; }

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-50px); }

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.5s ease; }
.slide-right-enter-from, .slide-right-leave-to { opacity: 0; transform: translateX(50px); }

@media (max-width: 768px) {
  .slide-enter-from, .slide-leave-to {
    opacity: 0;
    transform: translateY(50px) translateX(0);
  }
}
</style>
