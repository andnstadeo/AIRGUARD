<template>
  <div class="card">
    <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold app-heading">Recent Alerts</h3>
        <button
          v-if="alerts.length > 0"
          @click="clearAllAlerts"
          class="text-sm text-red-600 hover:text-red-800 transition-colors dark:text-red-400 dark:hover:text-red-300"
        >
          Clear All
        </button>
      </div>
    </div>

    <div class="divide-y divide-slate-200 max-h-96 overflow-y-auto dark:divide-slate-800">
      <div v-if="alerts.length === 0" class="px-6 py-8 text-center">
        <p class="app-text-muted">No alerts</p>
      </div>

      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="px-6 py-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 dark:hover:bg-slate-800/50"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="`badge-${alert.severity}`">{{ alert.severity }}</span>
            <p class="text-sm font-medium app-heading">{{ alert.message }}</p>
          </div>
          <p class="text-xs app-text-muted">{{ formatTime(alert.timestamp) }}</p>
        </div>
        <button
          @click="deleteAlert(alert.id)"
          class="text-slate-400 hover:text-red-600 transition-colors dark:text-slate-500 dark:hover:text-red-400"
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
