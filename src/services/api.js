// API Service for backend communication
// Replace localhost URLs with your actual backend when ready

import axios from 'axios'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const sensorAPI = {
  // Get all sensor readings
  getReadings: () => api.get('/sensors/readings'),

  // Get readings for a specific node
  getNodeReadings: (nodeId) => api.get(`/sensors/nodes/${nodeId}/readings`),

  // Get historical data
  getHistoricalData: (nodeId, startDate, endDate) =>
    api.get(`/sensors/nodes/${nodeId}/history`, {
      params: { startDate, endDate },
    }),

  // Get current status of all nodes
  getNodesStatus: () => api.get('/sensors/nodes/status'),

  // Add a new reading (usually done by hardware/backend)
  addReading: (data) => api.post('/sensors/readings', data),
}

export const nodeAPI = {
  // Get all registered nodes
  getAllNodes: () => api.get('/nodes'),

  // Get node details
  getNode: (nodeId) => api.get(`/nodes/${nodeId}`),

  // Register a new node
  registerNode: (data) => api.post('/nodes', data),

  // Update node configuration
  updateNode: (nodeId, data) => api.put(`/nodes/${nodeId}`, data),

  // Delete a node
  deleteNode: (nodeId) => api.delete(`/nodes/${nodeId}`),

  // Get node location
  getNodeLocation: (nodeId) => api.get(`/nodes/${nodeId}/location`),
}

export const alertAPI = {
  // Get all alerts
  getAllAlerts: () => api.get('/alerts'),

  // Create alert
  createAlert: (data) => api.post('/alerts', data),

  // Get alert thresholds
  getThresholds: () => api.get('/alerts/thresholds'),

  // Update alert thresholds
  updateThresholds: (data) => api.put('/alerts/thresholds', data),

  // Acknowledge alert
  acknowledgeAlert: (alertId) => api.put(`/alerts/${alertId}/acknowledge`),

  // Delete alert
  deleteAlert: (alertId) => api.delete(`/alerts/${alertId}`),
}

export const authAPI = {
  // Login with email/password
  login: (email, password) => api.post('/auth/login', { email, password }),

  // Register new user
  register: (userData) => api.post('/auth/register', userData),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Reset password
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
}

export default api
