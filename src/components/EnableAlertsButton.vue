<template>
  <button 
    @click="enableAlerts" 
    :class="['alert-btn', compact ? 'alert-btn-compact' : '']"
    :disabled="isSubscribed"
  >
    {{ isSubscribed ? '✅ Alerts Enabled' : '🔔 Enable Alerts' }}
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { requestNotificationPermission, setupForegroundListener } from '../services/firebase.js';

// Define the props so the parent can pass in the roomId
const props = defineProps({
  roomId: {
    type: String,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

// A small state variable to change the button text once clicked
const isSubscribed = ref(false);

const enableAlerts = async () => {
  // 1. Ask user for permission
  const token = await requestNotificationPermission();
  
  if (token) {
    try {
      // 2. Send the token to your Node.js backend
      await fetch('http://localhost:3000/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: token, 
          roomId: props.roomId // Use the prop here!
        })
      });

      // 3. Start listening and update the button UI!
      setupForegroundListener();
      isSubscribed.value = true;
      alert(`Alerts successfully enabled for ${props.roomId}!`);
      
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to enable alerts. Please try again.');
    }
  }
};
</script>

<style scoped>
.alert-btn {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.alert-btn:hover:not(:disabled) {
  background-color: #ff6b81;
}

.alert-btn:disabled {
  background-color: #2ed573;
  cursor: default;
}

.alert-btn-compact {
  padding: 8px 14px;
  border-radius: 9999px;
  font-size: 0.85rem;
  line-height: 1;
}
</style>