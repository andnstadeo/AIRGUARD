<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <div class="text-sm text-gray-500">{{ chartData.length }} readings</div>
    </div>

    <div class="relative h-80" ref="chartWrapper">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
      <div
        v-if="hoveredPoint"
        class="pointer-events-none absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
        :style="tooltipStyle"
      >
        <div class="font-semibold">PM2.5</div>
        <div>{{ hoveredPoint.value.toFixed(1) }} µg/m³</div>
        <div class="text-gray-300">{{ hoveredPoint.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Sensor Data',
  },
  chartData: {
    type: Array,
    default: () => [],
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'line',
  },
})

const chartCanvas = ref(null)
const chartWrapper = ref(null)
const hoveredPoint = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })
let resizeObserver = null

const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`,
  transform: 'translate(-50%, calc(-100% - 12px))',
}))

watch(
  () => props.chartData,
  () => {
    drawChart()
  },
  { deep: true }
)

watch(
  () => props.darkMode,
  () => {
    drawChart()
  }
)

onMounted(() => {
  drawChart()

  if (chartWrapper.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => drawChart())
    resizeObserver.observe(chartWrapper.value)
  }

  if (chartCanvas.value) {
    chartCanvas.value.addEventListener('mousemove', handleMouseMove)
    chartCanvas.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  if (chartCanvas.value) {
    chartCanvas.value.removeEventListener('mousemove', handleMouseMove)
    chartCanvas.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})

const drawChart = () => {
  if (!chartCanvas.value || props.chartData.length === 0) return

  const ctx = chartCanvas.value.getContext('2d')
  const width = chartWrapper.value.clientWidth
  const height = chartWrapper.value.clientHeight
  const gridColor = props.darkMode ? '#334155' : '#e2e8f0'
  const lineColor = props.darkMode ? '#38bdf8' : '#0ea5e9'
  const pointColor = props.darkMode ? '#7dd3fc' : '#0284c7'

  chartCanvas.value.width = width
  chartCanvas.value.height = height

  ctx.clearRect(0, 0, width, height)

  // Simple line chart drawing
  const padding = 40
  const graphWidth = width - 2 * padding
  const graphHeight = height - 2 * padding

  // Get max value for scaling
  const values = props.chartData.map(d => d.pm25 || d.aqi || d.dustLevel || 0)
  const maxValue = Math.max(...values, 1)

  // Draw axes
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  // Draw data line
  ctx.strokeStyle = lineColor
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
  ctx.fillStyle = pointColor
  props.chartData.forEach((point, index) => {
    const value = point.pm25 || point.aqi || point.dustLevel || 0
    const x = padding + (index / Math.max(props.chartData.length - 1, 1)) * graphWidth
    const y = height - padding - (value / maxValue) * graphHeight

    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
  })
}

const getChartPoints = () => {
  if (!chartCanvas.value || props.chartData.length === 0) return []

  const width = chartCanvas.value.width
  const height = chartCanvas.value.height
  const padding = 40
  const graphWidth = width - 2 * padding
  const graphHeight = height - 2 * padding
  const values = props.chartData.map(d => d.pm25 || d.aqi || d.dustLevel || 0)
  const maxValue = Math.max(...values, 1)

  return props.chartData.map((point, index) => {
    const value = point.pm25 || point.aqi || point.dustLevel || 0
    const x = padding + (index / Math.max(props.chartData.length - 1, 1)) * graphWidth
    const y = height - padding - (value / maxValue) * graphHeight

    return {
      x,
      y,
      value,
      time: point.time,
    }
  })
}

const handleMouseMove = (event) => {
  const canvas = chartCanvas.value
  const wrapper = chartWrapper.value
  if (!canvas || !wrapper || props.chartData.length === 0) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  const points = getChartPoints()

  let nearestPoint = null
  let nearestDistance = Infinity

  points.forEach((point) => {
    const distance = Math.hypot(point.x - mouseX, point.y - mouseY)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestPoint = point
    }
  })

  if (nearestPoint && nearestDistance <= 14) {
    hoveredPoint.value = nearestPoint
    tooltipPosition.value = {
      x: nearestPoint.x,
      y: nearestPoint.y,
    }
    canvas.style.cursor = 'pointer'
  } else {
    hoveredPoint.value = null
    canvas.style.cursor = 'default'
  }
}

const handleMouseLeave = () => {
  hoveredPoint.value = null
  if (chartCanvas.value) {
    chartCanvas.value.style.cursor = 'default'
  }
}
</script>
