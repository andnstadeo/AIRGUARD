require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const admin = require('firebase-admin');

// ==========================================
// 1. INITIALIZATION & MIDDLEWARE
// ==========================================
const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 2. FIREBASE ADMIN SETUP
// ==========================================
// Load your secret service account key (Ensure this is in .gitignore!)
const serviceAccount = require('./firebaseServiceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL // e.g., https://your-project.firebaseio.com
});

const db = admin.database();
const messaging = admin.messaging();

// Optional: Auth Middleware in case you still want custom REST routes
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }
  try {
    const idToken = authHeader.split('Bearer ')[1];
    req.user = await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};

// ==========================================
// 3. MQTT CLIENT SETUP (Hardware Integration)
// ==========================================
const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};

// Connect using the URL and the options object
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

mqttClient.on('connect', () => {
  console.log('✅ Connected to HiveMQ Cloud Broker');
  mqttClient.subscribe('airguard/+/sensors', (err) => {
    if (!err) console.log('📡 Subscribed to hardware sensor topics');
  });
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT Connection Error:', err.message);
});

mqttClient.on('offline', () => {
  console.log('⚠️ MQTT Client is offline. Trying to reconnect...');
});

// ==========================================
// 4. PROCESS HARDWARE DATA & TRIGGER ALERTS
// ==========================================
mqttClient.on('message', async (topic, message) => {
  try {
    // Extract room/node ID from the topic (e.g., "airguard/room_1/sensors" -> "room_1")
    const roomId = topic.split('/')[1]; 
    const sensorData = JSON.parse(message.toString());
    
    console.log(`[MQTT] Received data for ${roomId}:`, sensorData);

    // --- A. Store Time-Series Data in Realtime Database ---
    const readingsRef = db.ref(`rooms/${roomId}/readings`);
    
    // .push() automatically generates a unique, chronological ID
    await readingsRef.push({
      dustLevel: sensorData.dustLevel || 0,
      pm25: sensorData.pm25 || 0,
      pm10: sensorData.pm10 || 0,
      temperature: sensorData.temperature || 0,
      humidity: sensorData.humidity || 0,
      aqi: sensorData.aqi || 0,
      timestamp: admin.database.ServerValue.TIMESTAMP // Uses Firebase's server time
    });

    // --- B. Firebase Cloud Messaging (Alerts) ---
    const SAFE_DUST_THRESHOLD = 150; // Customize this based on your needs
    
    if (sensorData.dustLevel > SAFE_DUST_THRESHOLD) {
      console.log(`⚠️ ALERT: High dust level in ${roomId}. Triggering FCM...`);
      
      const payload = {
        notification: {
          title: 'AirGuard Alert 🚨',
          body: `Dust levels in ${roomId} have reached ${sensorData.dustLevel} µg/m³!`
        },
        // Sends to any frontend device subscribed to this specific room's alerts
        topic: `alerts_${roomId}` 
      };

      await messaging.send(payload);
      console.log(`📨 Push notification sent for ${roomId}`);
    }

  } catch (error) {
    console.error('❌ Error processing MQTT message:', error);
  }
});

// ==========================================
// 5. REST API ROUTES 
// ==========================================
// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Firebase IoT Bridge is running normally' });
});

// POST route to subscribe a web client to a specific room's alerts
app.post('/api/alerts/subscribe', async (req, res) => {
  const { token, roomId } = req.body;

  if (!token || !roomId) {
    return res.status(400).json({ error: 'Token and roomId are required' });
  }

  try {
    const topicName = `alerts_${roomId}`;
    // Use Firebase Admin to subscribe this device to the topic
    await admin.messaging().subscribeToTopic(token, topicName);
    
    console.log(`✅ Subscribed device to ${topicName}`);
    res.json({ success: true, message: `Subscribed to ${topicName}` });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    res.status(500).json({ error: 'Failed to subscribe to topic' });
  }
});

// ==========================================
// 6. START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});