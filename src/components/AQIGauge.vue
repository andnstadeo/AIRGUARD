<template>
  <div class="w-full h-full">
    <svg viewBox="0 0 200 200" class="w-full h-full">
      <!-- Background circle -->
      <circle cx="100" cy="100" r="95" fill="none" stroke="#e5e7eb" stroke-width="2" />

      <!-- Color segments -->
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        :stroke="getColorForValue(0, 50)"
        stroke-width="12"
        stroke-dasharray="133, 532"
        stroke-dashoffset="0"
        transform="rotate(-90 100 100)"
      />
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        :stroke="getColorForValue(50, 100)"
        stroke-width="12"
        stroke-dasharray="133, 532"
        stroke-dashoffset="-133"
        transform="rotate(-90 100 100)"
      />
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        :stroke="getColorForValue(100, 150)"
        stroke-width="12"
        stroke-dasharray="133, 532"
        stroke-dashoffset="-266"
        transform="rotate(-90 100 100)"
      />
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        :stroke="getColorForValue(150, 200)"
        stroke-width="12"
        stroke-dasharray="133, 532"
        stroke-dashoffset="-399"
        transform="rotate(-90 100 100)"
      />

      <!-- Needle -->
      <g :transform="`rotate(${needleAngle} 100 100)`">
        <line x1="100" y1="100" x2="100" y2="30" stroke="#1f2937" stroke-width="3" stroke-linecap="round" />
        <circle cx="100" cy="100" r="5" fill="#1f2937" />
      </g>

      <!-- Center circle background -->
      <circle cx="100" cy="100" r="25" fill="white" stroke="#e5e7eb" stroke-width="1" />

      <!-- Center text -->
      <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="20" font-weight="bold"
        fill="#1f2937">
        {{ value }}
      </text>
      <text x="100" y="115" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#6b7280">
        AQI
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
})

const needleAngle = computed(() => {
  const max = 300
  const percentage = Math.min(props.value / 300, 1)
  return -90 + percentage * max
})

const getColorForValue = (min, max) => {
  if (props.value >= min && props.value < max) {
    if (max <= 50) return '#10b981'
    if (max <= 100) return '#3b82f6'
    if (max <= 150) return '#f59e0b'
    return '#ef4444'
  }
  return '#d1d5db'
}
</script>
