<template>
  <div id="app">
    <Dashboard />
  </div>
</template>

<script setup>
import Dashboard from '@/pages/Dashboard.vue'

// Check if user is authenticated
const isAuthenticated = localStorage.getItem('authToken')
if (!isAuthenticated && window.location.pathname !== '/login') {
  window.location.href = '/login'
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
