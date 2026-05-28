import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken'))
  const isAuthenticated = computed(() => !!token.value)

  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('authToken', newToken)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
  }
})
