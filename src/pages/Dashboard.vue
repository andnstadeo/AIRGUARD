<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_38%),linear-gradient(135deg,_#f8fafc_0%,_#eef6ff_45%,_#f8fafc_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#020617_100%)] dark:text-slate-100">
    
    <Header
      :isConnected="sensorStore.isConnected"
      :currentNode="sensorStore.currentNode"
      @settings="showSettings = true"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div v-if="!sensorStore.sensorData || typeof sensorStore.sensorData.dustLevel === 'undefined'" class="flex flex-col items-center justify-center py-20 text-center">
        <h2 class="text-2xl font-bold mb-2">📡 Connecting to AirGuard...</h2>
        <p class="text-slate-500 dark:text-slate-400">Waiting for live sensor data from Firebase.</p>
      </div>

      <div v-else>
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

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div class="xl:col-span-8 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
              <div class="card p-5 md:p-6 h-full flex flex-col justify-between">
                <h3 class="text-lg font-semibold app-heading mb-4">Air Quality Index</h3>
                <div class="h-80 md:h-80 w-full flex items-center justify-center">
                  <AQIGauge class="w-56 h-56" :value="sensorStore.sensorData.aqi" :darkMode="isDarkMode" />
                </div>
                <div class="mt-4 text-center">
                  <p class="text-sm app-text mb-2">Status</p>
                  <p :class="`inline-flex items-center px-4 py-2 rounded-full font-semibold gap-2 badge-${sensorStore.aqiStatus.color}`">
                    {{ sensorStore.aqiStatus.icon }}
                    {{ sensorStore.aqiStatus.status }}
                  </p>
                </div>
              </div>

              <div class="card p-6 h-full flex flex-col justify-between">
                <h3 class="text-lg font-semibold app-heading mb-4">PM2.5 Trend</h3>
                <SimpleChart
                  title="Live PM2.5"
                  :chartData="sensorStore.chartData"
                  type="line"
                  :darkMode="isDarkMode"
                />
              </div>
            </div>

          </div>

          <aside class="xl:col-span-4">
            <div class="card p-6 sticky top-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-semibold app-heading">System Alerts</h3>
                    <p class="text-sm app-text-muted">Live alerts and warnings</p>
                  </div>
                  <EnableAlertsButton roomId="room_1" />
                </div>

                <AlertHistory
                  :alerts="alertStore.alerts"
                  @delete="handleDeleteAlert"
                  @clear="handleClearAlerts"
                />

                <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h3 class="text-lg font-semibold app-heading mb-4">Hardware Status</h3>
                  <div class="grid grid-cols-1 gap-4">
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
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div> </main>

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

// Firebase Imports
import { db } from '@/services/firebase.js'
import { ref as dbRef, onValue, query, limitToLast } from 'firebase/database'

// Component Imports
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
const lastUpdate = ref('Waiting for data...')
const signalStrength = ref(100) // Hardcoded to 100% since we removed the simulator interval
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

let unsubscribeDb = null 

onMounted(() => {
  // Connect to the specific room's data stream in Firebase
  const recentReadingsRef = query(
    dbRef(db, 'rooms/room_1/readings'), 
    limitToLast(1)
  )

  // Turn on the live listener
  unsubscribeDb = onValue(recentReadingsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const liveData = childSnapshot.val()
      
      // Update the Pinia store with real data
      sensorStore.updateSensorData(liveData)
      
      // Check if we need to log a visual alert
      checkThresholds(liveData)
      
      // Update the timestamp on the screen
      if (liveData.timestamp) {
        lastUpdate.value = new Date(liveData.timestamp).toLocaleTimeString()
      }
    })
    
    // Once data arrives, mark the hardware as connected
    sensorStore.setConnected(true)
  })
})

onUnmounted(() => {
  // Clean up the Firebase connection when navigating away
  if (unsubscribeDb) unsubscribeDb()
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
  // Prevent spamming the exact same alert within 60 seconds
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