<template>
  <div id="app" class="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
    <Dashboard />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Dashboard from '@/pages/Dashboard.vue'

onMounted(() => {
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true'
  document.documentElement.classList.toggle('dark', darkModeEnabled)
  document.body.classList.toggle('dark', darkModeEnabled)
})
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
</style>
