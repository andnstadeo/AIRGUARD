<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm app-text mb-1">{{ label }}</p>
        <p class="text-3xl font-bold app-heading">{{ value.toFixed(1) }}</p>
        <p class="text-xs app-text-muted mt-1">{{ unit }}</p>
      </div>
      <div class="text-4xl" :class="iconClass">
        {{ icon }}
      </div>
    </div>

    <div class="mt-4">
      <div class="flex items-center justify-between text-sm">
        <span class="app-text">Status</span>
        <span :class="statusClass"> {{ status }}</span>
      </div>
    </div>

    <div v-if="trending" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2">
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
