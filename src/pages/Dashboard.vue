<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <Header
      :isConnected="sensorStore.isConnected"
      :currentNode="sensorStore.currentNode"
      @settings="showSettings = true"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SensorCard
          label="Dust Level"
          :value="sensorStore.sensorData.dustLevel"
          unit="µg/m³"
          icon="💨"
          status="Normal"
          statusClass="badge-success"
        />
        <SensorCard
          label="PM2.5"
          :value="sensorStore.sensorData.pm25"
          unit="µg/m³"
          icon="🌫️"
          status="Normal"
          statusClass="badge-success"
        />
        <SensorCard
          label="Temperature"
          :value="sensorStore.sensorData.temperature"
          unit="°C"
          icon="🌡️"
          status="Normal"
          statusClass="badge-success"
        />
        <SensorCard
          label="Humidity"
          :value="sensorStore.sensorData.humidity"
          unit="%"
          icon="💧"
          status="Normal"
          statusClass="badge-success"
        />
      </div>

      <!-- Main Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- AQI Gauge -->
        <div class="lg:col-span-1">
          <div class="card p-6 h-full">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Air Quality Index</h3>
            <div class="h-64">
              <AQIGauge :value="sensorStore.sensorData.aqi" />
            </div>
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600 mb-2">Status</p>
              <p :class="`inline-flex items-center px-4 py-2 rounded-full font-semibold gap-2 badge-${sensorStore.aqiStatus.color}`">
                {{ sensorStore.aqiStatus.icon }}
                {{ sensorStore.aqiStatus.status }}
              </p>
            </div>
          </div>
        </div>

        <!-- Charts and Alerts -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Chart -->
          <SimpleChart
            title="PM2.5 Trend"
            :chartData="sensorStore.chartData"
            type="line"
          />

          <!-- Alerts -->
          <AlertHistory
            :alerts="alertStore.alerts"
            @delete="handleDeleteAlert"
            @clear="handleClearAlerts"
          />
        </div>
      </div>

      <!-- Hardware Connection Status -->
      <div class="mt-8 card p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Hardware Status</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 border border-gray-200 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Connected Nodes</p>
            <p class="text-3xl font-bold text-gray-900">1</p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Last Update</p>
            <p class="text-sm text-gray-900">{{ lastUpdate }}</p>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Signal Strength</p>
            <p class="text-sm text-gray-900">{{ signalStrength }}%</p>
          </div>
        </div>
        <div v-if="!sensorStore.isConnected" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Using simulated hardware data. Connect your ESP32 node to see real sensor readings.
          </p>
        </div>
      </div>
    </main>

    <!-- Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="w-full max-w-md max-h-screen overflow-y-auto">
        <SettingsPanel
          :thresholds="alertStore.alertThresholds"
          @save="handleSaveSettings"
          @close="showSettings = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSensorStore } from '@/stores/sensorStore'
import { useAlertStore } from '@/stores/alertStore'
import { hwSimulator } from '@/services/hardwareSimulator'
import Header from '@/components/Header.vue'
import SensorCard from '@/components/SensorCard.vue'
import AQIGauge from '@/components/AQIGauge.vue'
import SimpleChart from '@/components/SimpleChart.vue'
import AlertHistory from '@/components/AlertHistory.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

const sensorStore = useSensorStore()
const alertStore = useAlertStore()
const showSettings = ref(false)
const lastUpdate = ref('Just now')
const signalStrength = ref(95)
let simulationInterval = null
let statusUpdateInterval = null

onMounted(() => {
  // Start hardware simulation
  simulationInterval = setInterval(() => {
    const data = hwSimulator.generateData()
    sensorStore.updateSensorData(data)

    // Simulate alerts based on thresholds
    checkThresholds(data)

    // Update last update time
    const now = new Date()
    lastUpdate.value = now.toLocaleTimeString()
  }, 2000) // Update every 2 seconds

  // Update signal strength
  statusUpdateInterval = setInterval(() => {
    signalStrength.value = Math.max(70, 100 - Math.random() * 20)
  }, 5000)

  sensorStore.setConnected(true)

  // Initial data
  const initialData = hwSimulator.generateData()
  sensorStore.updateSensorData(initialData)
})

onUnmounted(() => {
  if (simulationInterval) clearInterval(simulationInterval)
  if (statusUpdateInterval) clearInterval(statusUpdateInterval)
})

const checkThresholds = (data) => {
  const thresholds = alertStore.alertThresholds

  if (data.dustLevel > thresholds.dustLevel) {
    addAlert('Dust Level', `Dust level is ${data.dustLevel.toFixed(1)} µg/m³`, 'warning')
  }

  if (data.pm25 > thresholds.pm25) {
    addAlert('PM2.5 Alert', `PM2.5 is ${data.pm25.toFixed(1)} µg/m³`, 'warning')
  }
}

const addAlert = (title, message, severity) => {
  const existingAlert = alertStore.alerts.find(
    a => a.message === message && new Date() - new Date(a.timestamp) < 60000
  )
  if (!existingAlert) {
    alertStore.addAlert({
      message,
      severity,
      title,
    })
  }
}

const handleDeleteAlert = (id) => {
  alertStore.deleteAlert(id)
}

const handleClearAlerts = () => {
  alertStore.clearAlerts()
}

const handleSaveSettings = (newThresholds) => {
  alertStore.updateThresholds(newThresholds)
  showSettings.value = false
}
</script>
