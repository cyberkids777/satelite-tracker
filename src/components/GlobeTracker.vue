<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Globe from 'globe.gl'

// Referencje do elementów DOM i stanu Vue
const globeContainer = ref<HTMLElement | null>(null)
const status = ref('Inicjalizacja systemu...')
const hasError = ref(false)

// Konfiguracja API
const API_KEY = import.meta.env.VITE_N2YO_API_KEY
const NORAD_ID = 25544 // ID Międzynarodowej Stacji Kosmicznej (ISS)
const SECONDS = 300    // Pobieramy trasę na 300 sekund do przodu

onMounted(() => {
  if (!globeContainer.value) return

  // 1. Inicjalizacja Globe.gl z konfiguracją kropki i ścieżki (orbity)
  const world = new Globe()(globeContainer.value)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .pointColor(() => '#ff2a2a')
    .pointAltitude('alt')
    .pointRadius(0.12)
    .pointResolution(32)
    .pathPointLat(p => p.lat)
    .pathPointLng(p => p.lng)
    .pathPointAlt(p => p.alt)
    .pathColor(() => 'rgba(255, 42, 42, 0.4)') // Półprzezroczysty ogon
    .pathStroke(2)

  world.controls().autoRotate = true
  world.controls().autoRotateSpeed = 0.5

  // 2. Logika pobierania i animacji wewnątrz onMounted
  const startTracking = async () => {
    try {
      status.value = 'Łączenie z API N2YO...'

      const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/${NORAD_ID}/0/0/0/${SECONDS}/&apiKey=${API_KEY}`
      // Używamy proxy, żeby Vite/przeglądarka nie rzucały błędami CORS
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`

      const response = await fetch(proxyUrl)
      const data = await response.json()

      if (!data.positions) throw new Error('API nie zwróciło pozycji.')

      // Mapujemy dane dla Globe.gl
      const trajectory = data.positions.map((pos: any) => ({
        lat: pos.satlatitude,
        lng: pos.satlongitude,
        alt: pos.sataltitude / 6371 // Skalowanie do promienia Ziemi
      }))

      status.value = 'Śledzenie aktywne! Aktualizacja co 1 sek.'
      hasError.value = false

      // Rysujemy całą trasę (ogon) z góry
      world.pathsData([trajectory])

      let currentIndex = 0

      // Pokazujemy aktualną pozycję (kropkę)
      world.pointsData([trajectory[currentIndex]])

      // Zmieniamy pozycję kropki co sekundę
      setInterval(() => {
        currentIndex++
        if (currentIndex < trajectory.length) {
          world.pointsData([trajectory[currentIndex]])
        } else {
          status.value = 'Trasa zakończona. Odśwież stronę.'
          hasError.value = true
        }
      }, 1000)

    } catch (error) {
      console.error(error)
      status.value = 'Błąd pobierania danych (sprawdź konsolę).'
      hasError.value = true
    }
  }

  startTracking()
})
</script>

<template>
  <div class="ui-overlay">
    <h2>📡 Śledzenie ISS na żywo</h2>
    <p>Satelita: Międzynarodowa Stacja Kosmiczna (25544)</p>
    <p :class="{ 'error-text': hasError, 'success-text': !hasError }">
      {{ status }}
    </p>
  </div>

  <div ref="globeContainer" class="globe-wrapper"></div>
</template>

<style scoped>
.globe-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}

.ui-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(20, 20, 20, 0.85);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #444;
  color: white;
  font-family: sans-serif;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  pointer-events: none; /* Żeby nie blokować obracania planety myszką pod panelem */
}

.ui-overlay h2 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.success-text {
  color: #4CAF50;
  font-weight: bold;
}

.error-text {
  color: #f44336;
  font-weight: bold;
}
</style>
