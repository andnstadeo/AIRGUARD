<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <div class="text-sm text-gray-500">{{ chartData.length }} readings</div>
    </div>

    <div class="h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Sensor Data',
  },
  chartData: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'line',
  },
})

const chartCanvas = ref(null)

watch(
  () => props.chartData,
  () => {
    drawChart()
  },
  { deep: true }
)

const drawChart = () => {
  if (!chartCanvas.value || props.chartData.length === 0) return

  const ctx = chartCanvas.value.getContext('2d')
  const width = chartCanvas.value.parentElement.clientWidth
  const height = chartCanvas.value.parentElement.clientHeight

  chartCanvas.value.width = width
  chartCanvas.value.height = height

  // Simple line chart drawing
  const padding = 40
  const graphWidth = width - 2 * padding
  const graphHeight = height - 2 * padding

  // Get max value for scaling
  const values = props.chartData.map(d => d.pm25 || d.aqi || d.dustLevel || 0)
  const maxValue = Math.max(...values, 1)

  // Draw axes
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  // Draw data line
  ctx.strokeStyle = '#0ea5e9'
  ctx.lineWidth = 2
  ctx.beginPath()

  props.chartData.forEach((point, index) => {
    const value = point.pm25 || point.aqi || point.dustLevel || 0
    const x = padding + (index / Math.max(props.chartData.length - 1, 1)) * graphWidth
    const y = height - padding - (value / maxValue) * graphHeight

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Draw points
  ctx.fillStyle = '#0284c7'
  props.chartData.forEach((point, index) => {
    const value = point.pm25 || point.aqi || point.dustLevel || 0
    const x = padding + (index / Math.max(props.chartData.length - 1, 1)) * graphWidth
    const y = height - padding - (value / maxValue) * graphHeight

    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
  })
}
</script>
