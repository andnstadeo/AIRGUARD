import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([])
  const alertThresholds = ref({
    dustLevel: 300,
    pm25: 35,
    pm10: 100,
    temperature: { min: 15, max: 30 },
    humidity: { min: 30, max: 70 },
  })

  const addAlert = (alert) => {
    alerts.value.unshift({
      id: Date.now(),
      timestamp: new Date(),
      ...alert,
    })
    if (alerts.value.length > 100) {
      alerts.value.pop()
    }
  }

  const deleteAlert = (id) => {
    alerts.value = alerts.value.filter(a => a.id !== id)
  }

  const clearAlerts = () => {
    alerts.value = []
  }

  const updateThresholds = (newThresholds) => {
    alertThresholds.value = { ...alertThresholds.value, ...newThresholds }
  }

  return {
    alerts,
    alertThresholds,
    addAlert,
    deleteAlert,
    clearAlerts,
    updateThresholds,
  }
})
