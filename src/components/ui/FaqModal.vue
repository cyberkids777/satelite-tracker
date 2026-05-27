<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Często zadawane pytania</h2>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <div class="modal-body">
        <div class="faq-item">
          <h3>Czym jest ta aplikacja?</h3>
          <p>Aplikacja pozwala na śledzenie satelit widocznych gołym okiem na nocnym niebie. Trajektorie i pozycje są obliczane bezpośrednio w Twojej przeglądarce na podstawie surowych danych TLE z bazy CelesTrak udostępnionych prze n2yo.com</p>
        </div>

        <div class="faq-item">
          <h3>Jak zapisać satelitę do ulubionych?</h3>
          <p>Musisz posiadać konto. Kliknij ikonę użytkownika w prawym dolnym rogu i zaloguj się przez Google. Po zalogowaniu w panelu wybranego satelity pojawi się ikona gwiazdki.</p>
        </div>

        <div class="faq-item">
          <h3>Co to jest NORAD ID?</h3>
          <p>To unikalny numer katalogowy nadawany przez dowództwo obrony kosmicznej USA każdemu ludzkiemu obiektowi krążącemu wokół Ziemi.</p>
        </div>

        <div class="faq-item">
          <h3>Dlaczego mapa czasami zwalnia?</h3>
          <p>Bo jestem średni w matme i zrobiłem co mogłem żeby to jakoś działało xD</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(4px); }
.modal-content { background: #1a1a1a; width: 90%; max-width: 500px; max-height: 80vh; border-radius: 12px; border: 1px solid #444; display: flex; flex-direction: column; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
.modal-header { padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
.modal-header h2 { margin: 0; font-size: 1.2rem; color: #FFCC00; }
.close-btn { background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; padding: 0 5px; }
.close-btn:hover { color: #fff; }
.modal-body { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

.faq-item h3 { margin: 0 0 6px 0; font-size: 1.05rem; color: #fff; }
.faq-item p { margin: 0; font-size: 0.9rem; color: #aaa; line-height: 1.5; }

/* Pasek przewijania */
.modal-body::-webkit-scrollbar { width: 8px; }
.modal-body::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
.modal-body::-webkit-scrollbar-thumb:hover { background: #555; }
</style>
