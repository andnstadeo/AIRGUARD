<template>
  <header class="surface-strong sticky top-4 z-40 mx-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo and Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl font-bold">🛡️</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold app-heading">AIRGUARD</h1>
            <p class="text-xs app-text-muted">Air Quality Monitoring</p>
          </div>
        </div>

        <!-- Status and Actions -->
        <div class="flex items-center gap-6">
          <!-- Connection Status -->
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm font-medium" :class="isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>

          <!-- Active Node -->
          <div v-if="currentNode" class="text-sm">
            <p class="app-text-muted">Node:</p>
            <p class="font-medium app-heading">{{ currentNode.name }}</p>
          </div>

          <!-- Settings Button -->
          <button
            @click="$emit('settings')"
            class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
            title="Settings"
          >
            ⚙️
          </button>

          <!-- User Menu Button -->
          <button
            @click="showUserMenu = !showUserMenu"
            class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
          >
            👤
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl z-50 top-full dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isConnected: Boolean,
  currentNode: Object,
})

defineEmits(['settings', 'logout'])

const showUserMenu = ref(false)

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  showUserMenu.value = false
}
</script>
