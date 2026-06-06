# Hardware Integration Guide

This guide explains how to connect your ESP32 hardware to the AIRGUARD application.

## Hardware Setup Overview

```
┌─────────────────┐
│   Sensors       │
│ (Dust, Temp)    │
└────────┬────────┘
         │
┌────────▼────────┐
│  ESP32/NodeMCU  │
│  (With Firmware)│
└────────┬────────┘
         │ WiFi/Ethernet
┌────────▼────────┐
│  Backend API    │
│  (Node.js/Py)   │
└────────┬────────┘
         │ HTTP/WebSocket
┌────────▼────────┐
│   Application   │
│  (This App)     │
└─────────────────┘
```

## Step 1: Hardware Components

### Required
- ESP32 or NodeMCU
- Dust sensor (PMS5003 or GP2Y1010AU0F)
- DHT22 temperature/humidity sensor
- 5V power supply

### Optional
- Buzzer
- RGB LED

## Step 2: ESP32 Firmware

### Arduino Sketch Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// API configuration
const char* serverName = "http://your-backend.com/api/sensors/readings";
const char* nodeId = "esp32-01";
const char* apiKey = "your-api-key";

// Sensor setup
#define DHT_PIN 4
#define DUST_PIN 34
DHT dht(DHT_PIN, DHT22);

// Timing
unsigned long lastTime = 0;
unsigned long timerDelay = 10000; // Send data every 10 seconds

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi Connected!");
  
  dht.begin();
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      // Read sensors
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature();
      float dustLevel = readDustSensor();
      float pm25 = dustLevel; // Convert or use separate PM sensor
      
      // Calculate AQI
      float aqi = calculateAQI(pm25);
      
      // Send to backend
      sendToBackend(temperature, humidity, dustLevel, pm25, aqi);
    }
    lastTime = millis();
  }
}

float readDustSensor() {
  // Read analog value from dust sensor
  int raw = analogRead(DUST_PIN);
  // Convert to µg/m³ based on your sensor calibration
  return raw * 0.1; // Adjust multiplier based on your sensor
}

float calculateAQI(float pm25) {
  // Simplified AQI calculation
  if (pm25 <= 12) return (pm25 / 12) * 50;
  if (pm25 <= 35.4) return ((pm25 - 12) / 23.4) * 50 + 50;
  return ((pm25 - 35.4) / 20) * 50 + 100;
}

void sendToBackend(float temp, float humidity, float dust, float pm25, float aqi) {
  HTTPClient http;
  
  String jsonData = "{";
  jsonData += "\"nodeId\":\"" + String(nodeId) + "\",";
  jsonData += "\"temperature\":" + String(temp) + ",";
  jsonData += "\"humidity\":" + String(humidity) + ",";
  jsonData += "\"dustLevel\":" + String(dust) + ",";
  jsonData += "\"pm25\":" + String(pm25) + ",";
  jsonData += "\"pm10\":" + String(pm25 * 2) + ",";
  jsonData += "\"aqi\":" + String((int)aqi);
  jsonData += "}";
  
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiKey));
  
  int httpResponseCode = http.POST(jsonData);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
```

## Step 3: Backend Setup

Create a simple Node.js backend (or use existing):

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Store latest reading
let latestReading = null;

// Receive data from ESP32
app.post('/api/sensors/readings', (req, res) => {
  const { nodeId, temperature, humidity, dustLevel, pm25, aqi } = req.body;
  
  // Store in database
  latestReading = {
    nodeId,
    temperature,
    humidity,
    dustLevel,
    pm25,
    aqi,
    timestamp: new Date().toISOString()
  };
  
  console.log('Received:', latestReading);
  
  // Broadcast to connected clients (WebSocket)
  // io.emit('sensorUpdate', latestReading);
  
  res.json({ success: true, timestamp: latestReading.timestamp });
});

// Get latest reading
app.get('/api/sensors/readings', (req, res) => {
  res.json(latestReading || {});
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Step 4: Application Connection

1. Update `.env.local`:
```env
VITE_API_URL=http://your-backend-ip:3000/api
```

2. Replace the hardware simulator with real API calls in `src/pages/Dashboard.vue`:

```javascript
// Instead of hwSimulator, use real API
import { sensorAPI } from '@/services/api'

// In onMounted:
simulationInterval = setInterval(async () => {
  try {
    const response = await sensorAPI.getReadings()
    sensorStore.updateSensorData(response.data)
    checkThresholds(response.data)
  } catch (error) {
    console.error('Failed to fetch sensor data:', error)
  }
}, 2000)
```

## Troubleshooting

### ESP32 can't connect to WiFi
- Check SSID and password
- Verify WiFi is 2.4GHz (not 5GHz)
- Check ESP32 signal strength

### Backend not receiving data
- Verify ESP32 IP address matches backend URL
- Check firewall settings
- Review backend logs
- Test with curl:
```bash
curl -X POST http://localhost:3000/api/sensors/readings \
  -H "Content-Type: application/json" \
  -d '{"nodeId":"esp32-01","dustLevel":150,"pm25":25,...}'
```

### App not showing real data
- Check API URL in .env.local
- Open browser console for errors
- Verify backend is running
- Check CORS settings

## Testing Without Hardware

The project includes a hardware simulator (part of the frontend). To use it:

1. Don't modify `src/pages/Dashboard.vue` (keep `hwSimulator`)
2. Test UI and functionality
3. When ready, switch to real API calls

## Production Deployment

When deploying to production:

1. Update `.env.local` with production backend URL
2. Build for production: `npm run build`
3. Deploy dist/ folder to hosting service
4. Configure backend to point to production database
5. Set up SSL/HTTPS
6. Configure proper authentication

## Next Steps

1. ✅ Application frontend is ready (you're here)
2. ⏳ Set up backend API
3. ⏳ Flash ESP32 with firmware
4. ⏳ Test connection
5. ⏳ Deploy to production

Good luck! 🚀
