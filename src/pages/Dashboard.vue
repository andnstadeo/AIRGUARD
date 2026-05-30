<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_38%),linear-gradient(135deg,_#f8fafc_0%,_#eef6ff_45%,_#f8fafc_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#020617_100%)] dark:text-slate-100">
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
          :status="getSensorStatus('dustLevel', sensorStore.sensorData.dustLevel).label"
          :statusClass="getSensorStatus('dustLevel', sensorStore.sensorData.dustLevel).className"
        />
        <SensorCard
          label="PM2.5"
          :value="sensorStore.sensorData.pm25"
          unit="µg/m³"
          icon="🌫️"
          :status="getSensorStatus('pm25', sensorStore.sensorData.pm25).label"
          :statusClass="getSensorStatus('pm25', sensorStore.sensorData.pm25).className"
        />
        <SensorCard
          label="Temperature"
          :value="sensorStore.sensorData.temperature"
          unit="°C"
          icon="🌡️"
          :status="getSensorStatus('temperature', sensorStore.sensorData.temperature).label"
          :statusClass="getSensorStatus('temperature', sensorStore.sensorData.temperature).className"
        />
        <SensorCard
          label="Humidity"
          :value="sensorStore.sensorData.humidity"
          unit="%"
          icon="💧"
          :status="getSensorStatus('humidity', sensorStore.sensorData.humidity).label"
          :statusClass="getSensorStatus('humidity', sensorStore.sensorData.humidity).className"
        />
      </div>

      <!-- Main Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- AQI Gauge -->
        <div class="lg:col-span-1">
          <div class="card p-6 h-full">
            <h3 class="text-lg font-semibold app-heading mb-4">Air Quality Index</h3>
            <div class="h-64">
              <AQIGauge :value="sensorStore.sensorData.aqi" :darkMode="isDarkMode" />
            </div>
            <div class="mt-4 text-center">
              <p class="text-sm app-text mb-2">Status</p>
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
            :darkMode="isDarkMode"
          />

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold app-heading">System Alerts</h3>
              <EnableAlertsButton roomId="room_1" />
            </div>

          <!-- Alerts -->
          <AlertHistory
            :alerts="alertStore.alerts"
            @delete="handleDeleteAlert"
            @clear="handleClearAlerts"
          />
        </div>
        </div>
      </div>

      <!-- Hardware Connection Status -->
      <div class="mt-8 card p-6">
        <h3 class="text-lg font-semibold app-heading mb-4">Hardware Status</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 border border-slate-200 rounded-xl dark:border-slate-800">
            <p class="text-sm app-text mb-2">Connected Nodes</p>
            <p class="text-3xl font-bold app-heading">1</p>
          </div>
          <div class="p-4 border border-slate-200 rounded-xl dark:border-slate-800">
            <p class="text-sm app-text mb-2">Last Update</p>
            <p class="text-sm app-heading">{{ lastUpdate }}</p>
          </div>
          <div class="p-4 border border-slate-200 rounded-xl dark:border-slate-800">
            <p class="text-sm app-text mb-2">Signal Strength</p>
            <p class="text-sm app-heading">{{ signalStrength }}%</p>
          </div>
        </div>
        <div v-if="!sensorStore.isConnected" class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-200">
          <p class="text-sm">
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
import EnableAlertsButton from '@/components/EnableAlertsButton.vue'

const sensorStore = useSensorStore()
const alertStore = useAlertStore()
const showSettings = ref(false)
const lastUpdate = ref('Just now')
const signalStrength = ref(95)
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
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

const handleSaveSettings = (payload) => {
  alertStore.updateThresholds(payload.thresholds)
  isDarkMode.value = payload.darkMode
  document.documentElement.classList.toggle('dark', payload.darkMode)
  document.body.classList.toggle('dark', payload.darkMode)
  localStorage.setItem('darkMode', String(payload.darkMode))
  showSettings.value = false
}

const getSensorStatus = (sensorKey, value) => {
  const thresholds = alertStore.alertThresholds

  if (sensorKey === 'temperature') {
    if (value < thresholds.temperature.min || value > thresholds.temperature.max) {
      return { label: 'Warning', className: 'badge-warning' }
    }
    return { label: 'Normal', className: 'badge-success' }
  }

  if (sensorKey === 'humidity') {
    if (value < thresholds.humidity.min || value > thresholds.humidity.max) {
      return { label: 'Warning', className: 'badge-warning' }
    }
    return { label: 'Normal', className: 'badge-success' }
  }

  if (value > thresholds[sensorKey]) {
    return { label: 'Warning', className: 'badge-warning' }
  }

  return { label: 'Normal', className: 'badge-success' }
}
</script>
