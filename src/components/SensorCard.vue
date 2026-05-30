<template>
  <div class="card p-4 sm:p-6 h-full flex flex-col justify-between">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <p class="text-sm app-text mb-1">{{ label }}</p>
        <p class="text-2xl sm:text-3xl font-bold app-heading">{{ value.toFixed(1) }}</p>
        <p class="text-xs app-text-muted mt-1">{{ unit }}</p>
      </div>
      <div class="text-3xl sm:text-4xl flex-shrink-0" :class="iconClass">
        {{ icon }}
      </div>
    </div>

    <div class="mt-3">
      <div class="flex items-center justify-between text-sm">
        <span class="app-text">Status</span>
        <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`"> {{ status }}</span>
      </div>
    </div>

    <div v-if="trending !== null" class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2 text-sm">
        <span v-if="trending > 0" class="text-red-500">📈 {{ trending.toFixed(1) }}%</span>
        <span v-else class="text-green-500">📉 {{ Math.abs(trending).toFixed(1) }}%</span>
        <span class="text-xs app-text">vs last hour</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '📊',
  },
  status: {
    type: String,
    default: 'Normal',
  },
  statusClass: {
    type: String,
    default: 'badge-success',
  },
  trending: {
    type: Number,
    default: null,
  },
})

const iconClass = computed(() => {
  return 'text-5xl opacity-80'
})
</script>
