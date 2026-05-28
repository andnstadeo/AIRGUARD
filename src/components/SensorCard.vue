<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm text-gray-600 mb-1">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900">{{ value.toFixed(1) }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ unit }}</p>
      </div>
      <div class="text-4xl" :class="iconClass">
        {{ icon }}
      </div>
    </div>

    <div class="mt-4">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Status</span>
        <span :class="statusClass"> {{ status }}</span>
      </div>
    </div>

    <div v-if="trending" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center gap-2">
        <span v-if="trending > 0" class="text-red-500">📈 {{ trending.toFixed(1) }}%</span>
        <span v-else class="text-green-500">📉 {{ Math.abs(trending).toFixed(1) }}%</span>
        <span class="text-xs text-gray-600">vs last hour</span>
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
