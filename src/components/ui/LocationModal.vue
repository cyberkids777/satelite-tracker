<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['close', 'set-location'])

const lat = ref('')
const lng = ref('')
const errorMsg = ref('')

const handleSave = () => {
  const parsedLat = parseFloat(lat.value)
  const parsedLng = parseFloat(lng.value)

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    errorMsg.value = 'Wprowadź poprawne liczby!'
    return
  }

  emit('set-location', { lat: parsedLat, lng: parsedLng })
  emit('close')
}

const locateMe = () => {
  errorMsg.value = 'Szukanie sygnału GPS...'
  if (!navigator.geolocation) {
    errorMsg.value = 'Twoja przeglądarka nie wspiera geolokalizacji.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat.value = position.coords.latitude.toFixed(4)
      lng.value = position.coords.longitude.toFixed(4)
      errorMsg.value = ''
      handleSave()
    },
    () => {
      errorMsg.value = 'Odmówiono dostępu do lokalizacji lub błąd sygnału.'
    }
  )
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Twoja Lokalizacja</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <p class="desc">Ustaw swoją pozycję, aby ułatwić śledzenie przelotów nad Twoją głową.</p>

        <button class="gps-btn" @click="locateMe">Użyj mojego GPS</button>

        <div class="divider"><span>LUB RĘCZNIE</span></div>

        <div class="input-group">
          <label>Szerokość (Lat):</label>
          <input type="number" step="0.0001" v-model="lat" placeholder="np. 52.2297" />
        </div>
        <div class="input-group">
          <label>Długość (Lng):</label>
          <input type="number" step="0.0001" v-model="lng" placeholder="np. 21.0122" />
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button class="save-btn" @click="handleSave">Zapisz pozycję</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}
.modal-content { background: rgba(20, 20, 20, 0.95); border: 1px solid #444; border-radius: 16px; width: 320px; color: #fff; font-family: sans-serif; box-shadow: 0 10px 40px rgba(0,0,0,0.8); overflow: hidden; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #1a1a1a; border-bottom: 1px solid #333; }
.modal-header h3 { margin: 0; font-size: 1.1rem; color: #FFCC00; }
.close-btn { background: none; border: none; color: #aaa; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
.close-btn:hover { color: #fff; }
.modal-body { padding: 20px; }
.desc { font-size: 0.85rem; color: #aaa; margin-top: 0; margin-bottom: 15px; line-height: 1.4; }
.gps-btn { width: 100%; padding: 10px; background: #007AFF; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; margin-bottom: 15px; }
.gps-btn:hover { background: #005bb5; }
.divider { text-align: center; margin: 15px 0; position: relative; }
.divider::before { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: #444; z-index: 1; }
.divider span { background: rgba(20, 20, 20, 1); padding: 0 10px; color: #666; font-size: 0.75rem; position: relative; z-index: 2; font-weight: bold; }
.input-group { margin-bottom: 15px; display: flex; flex-direction: column; }
.input-group label { font-size: 0.8rem; color: #ccc; margin-bottom: 5px; }
.input-group input { padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid #444; border-radius: 6px; color: white; outline: none; }
.input-group input:focus { border-color: #FFCC00; }
.error { color: #ff4444; font-size: 0.85rem; margin-bottom: 10px; text-align: center; }
.save-btn { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.save-btn:hover { background: #218838; }
</style>
