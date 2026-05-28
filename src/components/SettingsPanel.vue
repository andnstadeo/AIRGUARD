<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
      >
        ✕
      </button>
    </div>

    <div class="space-y-6">
      <!-- Alert Thresholds -->
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Alert Thresholds</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Dust Level (µg/m³)
            </label>
            <input
              v-model.number="localThresholds.dustLevel"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              PM2.5 (µg/m³)
            </label>
            <input
              v-model.number="localThresholds.pm25"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              PM10 (µg/m³)
            </label>
            <input
              v-model.number="localThresholds.pm10"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Display Settings -->
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Display</h3>
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="darkMode" type="checkbox" class="rounded" />
          <span class="text-sm text-gray-700">Dark Mode</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4">
        <button
          @click="saveSettings"
          class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Save Changes
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  thresholds: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'save'])

const localThresholds = ref({ ...props.thresholds })
const darkMode = ref(localStorage.getItem('darkMode') === 'true')

const saveSettings = () => {
  emit('save', localThresholds.value)
  localStorage.setItem('darkMode', darkMode.value)
}
</script>
