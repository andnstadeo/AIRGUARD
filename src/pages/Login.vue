<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="card p-8 shadow-2xl">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
            <span class="text-white text-4xl">🛡️</span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">AIRGUARD</h1>
        <p class="text-center text-gray-600 mb-8">Indoor Air Quality Monitoring</p>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Demo Notice -->
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            📝 Use demo credentials or Firebase authentication
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="demo@airguard.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input v-model="rememberMe" type="checkbox" class="rounded" />
            <label class="ml-2 text-sm text-gray-700">Remember me</label>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <!-- Demo Login -->
          <button
            type="button"
            @click="handleDemoLogin"
            class="w-full py-2 px-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all"
          >
            Demo Login (No Backend)
          </button>
        </form>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {{ error }}
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Group 3 | Section 4-6</p>
          <p class="mt-1">IoT-Based Dust Level Monitoring System</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('demo@airguard.com')
const password = ref('demo1234')
const rememberMe = ref(true)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Demo login - in production, this would call your backend
    if (email.value === 'demo@airguard.com' && password.value === 'demo1234') {
      localStorage.setItem('authToken', 'demo-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify({ email: email.value, name: 'Demo User' }))
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
      // Navigate to dashboard
      window.location.href = '/dashboard'
    } else {
      error.value = 'Invalid credentials'
    }
  } catch (err) {
    error.value = err.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = () => {
  email.value = 'demo@airguard.com'
  password.value = 'demo1234'
  handleLogin()
}
</script>
