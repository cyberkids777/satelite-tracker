<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  satellites: any[]
}>()

const emit = defineEmits(['select'])

const searchQuery = ref('')
const isDropdownOpen = ref(false)
const searchContainer = ref<HTMLElement | null>(null)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return props.satellites
    .filter(s => s.name.toLowerCase().includes(query))
    .slice(0, 6)
})

const handleSelect = (sat: any) => {
  emit('select', sat)
  searchQuery.value = ''
  isDropdownOpen.value = false
}

const closeDropdown = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))
</script>

<template>
  <div class="search-container" ref="searchContainer">
    <input
      type="text"
      v-model="searchQuery"
      @focus="isDropdownOpen = true"
      placeholder="Wyszukaj satelitę"
      class="search-input"
    />

    <transition name="fade">
      <ul v-if="isDropdownOpen && searchResults.length > 0" class="search-results">
        <li
          v-for="sat in searchResults"
          :key="sat.id"
          @click="handleSelect(sat)"
        >
          {{ sat.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.search-container {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  width: 320px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border-radius: 30px;
  border: 1px solid #444;
  background: rgba(15, 15, 15, 0.85);
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  outline: none;
  backdrop-filter: blur(5px);
  transition: border-color 0.3s, background-color 0.3s;
}

.search-input:focus {
  border-color: #FFCC00;
  background: rgba(25, 25, 25, 0.95);
}

.search-input::placeholder {
  color: #888;
}

.search-results {
  list-style: none;
  margin: 8px 0 0 0;
  padding: 0;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid #444;
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
}

.search-results li {
  padding: 12px 20px;
  border-bottom: 1px solid #333;
  color: #E0F7FA;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.search-results li:last-child {
  border-bottom: none;
}

.search-results li:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #FFCC00;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 768px) {
  .search-container {
    top: 20px;
    left: 15px;
    transform: none;
    width: calc(100% - 80px);
  }
}
</style>
