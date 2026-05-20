<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth.ts'

defineEmits(['close'])

const { user, loginWithGoogle, logout } = useAuth()
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    errorMsg.value = ''
    await loginWithGoogle()
  } catch (err: any) {
    errorMsg.value = err.message || 'Nie udało się połączyć z Google.'
  }
}

const handleLogout = async () => {
  try {
    errorMsg.value = ''
    await logout()
  } catch (err: any) {
    errorMsg.value = err.message || 'Błąd podczas wylogowywania.'
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ user ? 'Twój Profil' : 'Logowanie' }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div v-if="user" class="profile-view">
          <img
            :src="user.user_metadata?.avatar_url || 'https://via.placeholder.com/60'"
            alt="Avatar"
            class="avatar"
          />
          <h4 class="user-name">{{ user.user_metadata?.full_name || 'Użytkownik' }}</h4>
          <p class="user-email">{{ user.email }}</p>

          <button class="logout-btn" @click="handleLogout">Wyloguj się</button>
        </div>

        <div v-else class="login-view">
          <p class="desc">Zaloguj się, aby odblokować dodatkowe funkcje.</p>

          <button class="google-btn" @click="handleLogin">
            <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.64 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Zaloguj przez Google
          </button>
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
.modal-content { background: rgba(20, 20, 20, 0.95); border: 1px solid #444; border-radius: 16px; width: 320px; color: #fff; font-family: sans-serif; box-shadow: 0 10px 40px rgba(0,0,0,0.8); overflow: hidden; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #1a1a1a; border-bottom: 1px solid #333; }
.modal-header h3 { margin: 0; font-size: 1.1rem; }
.close-btn { background: none; border: none; color: #aaa; font-size: 1.2rem; cursor: pointer; }
.close-btn:hover { color: #fff; }
.modal-body { padding: 25px 20px; }

/* Styl Profilu */
.profile-view { display: flex; flex-direction: column; align-items: center; text-align: center; }
.avatar { width: 64px; height: 64px; border-radius: 50%; border: 2px solid; margin-bottom: 12px; }
.user-name { margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 600; }
.user-email { margin: 0 0 15px 0; font-size: 0.85rem; color: #aaa; }
.status-badge { font-size: 0.75rem; padding: 4px 12px; background: rgba(76, 175, 80, 0.2); color: #4CAF50; border-radius: 12px; font-weight: bold; margin-bottom: 20px; }
.logout-btn { width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.logout-btn:hover { background: #bd2130; }

/* Styl Logowania */
.desc { font-size: 0.85rem; color: #aaa; margin-top: 0; margin-bottom: 25px; line-height: 1.4; text-align: center; }
.google-btn { width: 100%; padding: 12px; background: #fff; color: #333; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 0.95rem; transition: background 0.2s; }
.google-btn:hover { background: #f1f1f1; }
.google-icon { width: 18px; height: 18px; }

.error { color: #ff4444; font-size: 0.85rem; margin-top: 15px; margin-bottom: 0; text-align: center; }
</style>
