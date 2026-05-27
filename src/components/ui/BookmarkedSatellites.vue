<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import { useBookmarks } from '../../composables/useBookmarks'

const emit = defineEmits(['select-satellite', 'close'])

const { user } = useAuth()
const { bookmarksList, toggleBookmark } = useBookmarks()

const handleSelect = (noradId: string) => {
  emit('select-satellite', noradId)
}

const handleRemove = (satellite: { norad_id: string; name: string }) => {
  if (user.value) {
    toggleBookmark(user.value.id, { id: satellite.norad_id, name: satellite.name })
  }
}
</script>

<template>
  <div class="bookmarks-panel">
    <div class="panel-header">
      <h2>Twoje Zakładki</h2>
      <div>
        <button @click="$emit('close')" class="close-btn">✖</button>
      </div>
    </div>

    <div class="panel-content">
      <div v-if="user">
        <div v-if="bookmarksList.length === 0" class="empty-message">
          Brak zapisanych obiektów.<br>Kliknij gwiazdkę w panelu satelity, aby go dodać.
        </div>

        <ul v-else class="bookmarks-list">
          <li v-for="sat in bookmarksList" :key="sat.norad_id" class="bookmark-item">
            <div class="sat-info" @click="handleSelect(sat.norad_id)" title="Zlokalizuj na mapie">
              <span class="sat-name">{{ sat.name }}</span>
              <span class="sat-id">NORAD ID: {{ sat.norad_id }}</span>
            </div>
            <button class="delete-btn" @click="handleRemove(sat)" title="Usuń z zakładek">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <div v-else class="unauthenticated-view">
        <div class="lock-icon">🔒</div>
        <p class="message">Zaloguj się, aby dodawać satelity do zakładek i synchronizować je na wszystkich swoich urządzeniach.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-panel {
  position: absolute;
  top: 350px; left: 20px; width: 320px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid #444; border-radius: 12px;
  z-index: 20; font-family: 'Segoe UI', sans-serif; color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8); backdrop-filter: blur(5px);
  overflow: hidden; max-height: 45vh;
  display: flex; flex-direction: column;
}
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #333; }
.panel-header h2 { margin: 0; font-size: 1.1rem; color: #FFCC00; }
.panel-content { padding: 15px; overflow-y: auto; flex-grow: 1; }
.empty-message { font-size: 0.85rem; color: #aaa; text-align: center; line-height: 1.5; padding: 15px 0; }

.bookmarks-list { list-style: none; padding: 0; margin: 0; }
.bookmark-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-bottom: 1px solid #2a2a2a; transition: background 0.2s; border-radius: 6px; margin-bottom: 4px; }
.bookmark-item:last-child { border-bottom: none; margin-bottom: 0; }
.bookmark-item:hover { background: rgba(255, 255, 255, 0.05); }

.sat-info { display: flex; flex-direction: column; cursor: pointer; flex-grow: 1; margin-right: 10px; }
.sat-name { font-size: 0.9rem; font-weight: 600; color: #fff; transition: color 0.2s; }
.bookmark-item:hover .sat-name { color: #4CAF50; }
.sat-id { font-size: 0.75rem; color: #888; margin-top: 2px; }

.delete-btn { background: none; border: none; color: #888; cursor: pointer; padding: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.delete-btn:hover { color: #ff4444; background: rgba(255, 68, 68, 0.1); }

.unauthenticated-view { text-align: center; padding: 20px 10px; }
.lock-icon { font-size: 1.8rem; margin-bottom: 12px; }
.message { font-size: 0.85rem; color: #aaa; line-height: 1.4; margin: 0; }

.close-btn { background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; padding: 0 5px; }
.close-btn:hover { color: #fff; }

@media (max-width: 768px) {
  .bookmarks-panel {
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
