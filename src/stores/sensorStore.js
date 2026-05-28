import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSensorStore = defineStore('sensor', () => {
  const sensorData = ref({
    dustLevel: 0,
    pm25: 0,
    pm10: 0,
    temperature: 0,
    humidity: 0,
    aqi: 0,
    timestamp: new Date(),
  })

  const chartData = ref([])
  const isConnected = ref(false)
  const currentNode = ref(null)

  const aqiStatus = computed(() => {
    const aqi = sensorData.value.aqi
    if (aqi <= 50) return { status: 'Good', color: 'success', icon: '😊' }
    if (aqi <= 100) return { status: 'Moderate', color: 'warning', icon: '😐' }
    if (aqi <= 150) return { status: 'Unhealthy for Sensitive', color: 'warning', icon: '😷' }
    if (aqi <= 200) return { status: 'Unhealthy', color: 'danger', icon: '😷' }
    if (aqi <= 300) return { status: 'Very Unhealthy', color: 'danger', icon: '🤒' }
    return { status: 'Hazardous', color: 'danger', icon: '☠️' }
  })

  const updateSensorData = (data) => {
    sensorData.value = {
      ...data,
      timestamp: new Date(),
    }
    chartData.value.push({
      ...data,
      time: new Date().toLocaleTimeString(),
    })
    if (chartData.value.length > 60) {
      chartData.value.shift()
    }
  }

  const setConnected = (status) => {
    isConnected.value = status
  }

  const setCurrentNode = (node) => {
    currentNode.value = node
  }

  return {
    sensorData,
    chartData,
    isConnected,
    currentNode,
    aqiStatus,
    updateSensorData,
    setConnected,
    setCurrentNode,
  }
})
