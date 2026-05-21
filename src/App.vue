<script setup lang="ts">
import GlobeTracker from './components/GlobeTracker.vue'
import { watch } from 'vue'
import { useAuth } from './composables/useAuth'
import { useBookmarks } from './composables/useBookmarks'

const { user } = useAuth()
const { fetchBookmarks } = useBookmarks()

watch(user, (newUser) => {
  if (newUser) {
    fetchBookmarks(newUser.id)
  } else {
    fetchBookmarks('')
  }
}, { immediate: true })
</script>

<template>
  <GlobeTracker />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  padding: 0;
  max-width: none;
}
</style>
