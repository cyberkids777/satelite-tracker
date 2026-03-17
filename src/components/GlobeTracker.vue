<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onUnmounted } from 'vue'
import * as satellite from 'satellite.js' // Import naszej nowej biblioteki
import SatellitePanel from './ui/SatelitePanel.vue'
import TopSatellitesPanel from './ui/TopSatellitesPanel.vue'
import GlobeScene from './GlobeScene.vue'

const status = ref('Inicjalizacja systemu...')
const hasError = ref(false)
const selectedSat = ref<any>(null)

const satellites = ref<any[]>([])
const history = ref<any[]>([])

// Surowe rekordy matematyczne TLE, z których wyliczamy pozycje
let satRecs: any[] = []
let animationInterval: number

const startTracking = async () => {
  try {
    status.value = 'Pobieranie bazy danych z CelesTrak...'

    // Pobieramy paczkę "100 Najjaśniejszych Satelitów" (W tym ISS)
    const url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle'
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`

    const response = await fetch(proxyUrl)
    const text = await response.text()

    // CelesTrak zwraca po prostu plik tekstowy. Każdy satelita to 3 linijki tekstu.
    const lines = text.split('\n').map(l => l.trim())
    for (let i = 0; i < lines.length; i += 3) {
      const name = lines[i]
      const tle1 = lines[i + 1]
      const tle2 = lines[i + 2]

      if (name && tle1 && tle2) {
        try {
          // Kompilujemy tekst do rekordu matematycznego
          const satrec = satellite.twoline2satrec(tle1, tle2)
          satRecs.push({ id: satrec.satnum, name, satrec })
        } catch {
          // Ignorujemy zepsute rekordy, jeśli jakieś są
        }
      }
    }

    status.value = `Radar aktywny: Śledzenie ${satRecs.length} obiektów.`
    hasError.value = false

    // Zamiast pytać API, wyliczamy pozycje samodzielnie na naszym komputerze!
    animationInterval = setInterval(calculatePositions, 1000)
    calculatePositions()

  } catch (error) {
    console.error(error)
    status.value = 'Błąd pobierania bazy TLE.'
    hasError.value = true
  }
}

// Funkcja, która dla każdego satelity wylicza jego fizyczną pozycję na "TERAZ"
const calculatePositions = () => {
  const now = new Date()
  const gmst = satellite.gstime(now)
  const currentPositions: any[] = []

  satRecs.forEach(sat => {
    // Magia biblioteki: "Podaj mi pozycję i prędkość na dany czas"
    const positionAndVelocity = satellite.propagate(sat.satrec, now)

    if (!positionAndVelocity) return

    const positionEci = positionAndVelocity.position
    const velocity = positionAndVelocity.velocity

    if (positionEci && velocity) {
      // Zamiana wektorów kosmicznych na długość i szerokość geograficzną
      const positionGd = satellite.eciToGeodetic(positionEci as any, gmst)

      // Obliczanie prędkości (wzór na długość wektora)
      const speedKmS = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2) + Math.pow(velocity.z, 2))

      currentPositions.push({
        id: sat.id, // Unikalne ID to u nas to numer NORAD
        name: sat.name,
        lat: satellite.degreesLat(positionGd.latitude),
        lng: satellite.degreesLong(positionGd.longitude),
        alt: positionGd.height / 6371,
        realAlt: positionGd.height,
        speed: speedKmS * 3600, // zamiana km/s na km/h
        timestamp: now.toLocaleTimeString()
      })
    }
  })

  // Wypychamy wyliczoną armię do GlobeScene.vue
  satellites.value = currentPositions

  // Jeśli panel boczny jest otwarty, odświeżamy cyferki w czasie rzeczywistym
  if (selectedSat.value) {
    const updatedSat = currentPositions.find(s => s.id === selectedSat.value.id)
    if (updatedSat) {
      selectedSat.value = updatedSat
    }
  }
}

// Zamiast zbierać ogon punkt po punkcie, wyliczamy go natychmiast z matematyki!
const buildHistoryTrail = (satrec: any) => {
  if (!satrec) return
  const now = new Date()
  const pastPositions = []

  // Idziemy 90 minut wstecz (przeciętny czas okrążenia Ziemi), co 1 minutę
  for (let i = 90; i >= 0; i--) {
    const pastDate = new Date(now.getTime() - i * 60000)
    const positionAndVelocity = satellite.propagate(satrec, pastDate)

    if (!positionAndVelocity) return;

    const positionEci = positionAndVelocity.position

    if (positionEci) {
      const gmst = satellite.gstime(pastDate)
      const positionGd = satellite.eciToGeodetic(positionEci as any, gmst)
      pastPositions.push({
        lat: satellite.degreesLat(positionGd.latitude),
        lng: satellite.degreesLong(positionGd.longitude),
        alt: positionGd.height / 6371
      })
    }
  }
  history.value = pastPositions
}

onMounted(() => {
  startTracking()
})

onUnmounted(() => {
  clearInterval(animationInterval)
})

// Kliknięcie w etykietę otwiera panel i NATYCHMIAST rysuje cały ogon
const handleSatelliteClick = (sat: any) => {
  selectedSat.value = sat

  // Szukamy oryginalnego rekordu TLE dla klikniętego satelity
  const originalRecord = satRecs.find(s => s.id === sat.id)
  buildHistoryTrail(originalRecord?.satrec)
}

const closePanel = () => {
  selectedSat.value = null
  history.value = [] // Po zamknięciu panelu, chowamy również ogon
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
        v-if="satellites.length > 0"
        :satellites="satellites"
        @select="handleSatelliteClick"
      />
    </transition>

    <GlobeScene
      :satellites="satellites"
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

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.5s ease; }
.slide-right-enter-from, .slide-right-leave-to { opacity: 0; transform: translateX(50px); }
</style>
