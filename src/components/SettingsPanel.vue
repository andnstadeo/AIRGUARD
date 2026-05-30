<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold app-heading">Settings</h2>
      <button
        @click="$emit('close')"
        class="text-slate-400 hover:text-slate-600 text-2xl leading-none dark:text-slate-500 dark:hover:text-slate-300"
      >
        ✕
      </button>
    </div>

    <div class="space-y-6">
      <!-- Alert Thresholds -->
      <div>
        <h3 class="text-lg font-semibold app-heading mb-4">Alert Thresholds</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium app-text mb-2">
              Dust Level (µg/m³)
            </label>
            <input
              v-model.number="localThresholds.dustLevel"
              type="number"
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-medium app-text mb-2">
              PM2.5 (µg/m³)
            </label>
            <input
              v-model.number="localThresholds.pm25"
              type="number"
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-medium app-text mb-2">
              PM10 (µg/m³)
            </label>
            <input
              v-model.number="localThresholds.pm10"
              type="number"
              class="input-field"
            />
          </div>
        </div>
      </div>

      <!-- Display Settings -->
      <div>
        <h3 class="text-lg font-semibold app-heading mb-4">Display</h3>
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="darkMode" type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
          <span class="text-sm app-text">Dark Mode</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4">
        <button
          @click="saveSettings"
          class="btn-primary flex-1"
        >
          Save Changes
        </button>
        <button
          @click="$emit('close')"
          class="btn-secondary flex-1"
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
  emit('save', {
    thresholds: localThresholds.value,
    darkMode: darkMode.value,
  })
  localStorage.setItem('darkMode', darkMode.value)
}
</script>
