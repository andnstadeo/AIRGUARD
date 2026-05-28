<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo and Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl font-bold">🛡️</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">AIRGUARD</h1>
            <p class="text-xs text-gray-600">Air Quality Monitoring</p>
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
            <span class="text-sm font-medium" :class="isConnected ? 'text-green-600' : 'text-red-600'">
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>

          <!-- Active Node -->
          <div v-if="currentNode" class="text-sm">
            <p class="text-gray-600">Node:</p>
            <p class="font-medium text-gray-900">{{ currentNode.name }}</p>
          </div>

          <!-- Settings Button -->
          <button
            @click="$emit('settings')"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            ⚙️
          </button>

          <!-- User Menu Button -->
          <button
            @click="showUserMenu = !showUserMenu"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            👤
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 top-full"
            >
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
  // Emit logout event
}
</script>
