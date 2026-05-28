<template>
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">Recent Alerts</h3>
        <button
          v-if="alerts.length > 0"
          @click="clearAllAlerts"
          class="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>

    <div class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
      <div v-if="alerts.length === 0" class="px-6 py-8 text-center">
        <p class="text-gray-500">No alerts</p>
      </div>

      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="px-6 py-4 hover:bg-gray-50 transition-colors flex items-start justify-between gap-4"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="`badge-${alert.severity}`">{{ alert.severity }}</span>
            <p class="text-sm font-medium text-gray-900">{{ alert.message }}</p>
          </div>
          <p class="text-xs text-gray-600">{{ formatTime(alert.timestamp) }}</p>
        </div>
        <button
          @click="deleteAlert(alert.id)"
          class="text-gray-400 hover:text-red-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  alerts: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['delete', 'clear'])

const formatTime = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

const deleteAlert = (id) => {
  emit('delete', id)
}

const clearAllAlerts = () => {
  emit('clear')
}
</script>
