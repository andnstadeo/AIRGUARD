# Backend API Endpoints Reference

This document describes the API endpoints that your backend should implement.
The frontend in `src/services/api.js` expects these endpoints.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All requests should include:
```
Authorization: Bearer {token}
```

## Endpoints

### Sensors

#### Get Latest Readings
```
GET /sensors/readings
Response:
{
  dustLevel: number,
  pm25: number,
  pm10: number,
  temperature: number,
  humidity: number,
  aqi: number,
  timestamp: ISO8601
}
```

#### Get Node Readings
```
GET /sensors/nodes/{nodeId}/readings
Response: Same as above
```

#### Get Historical Data
```
GET /sensors/nodes/{nodeId}/history?startDate=ISO8601&endDate=ISO8601
Response:
[
  { dustLevel, pm25, pm10, temperature, humidity, aqi, timestamp },
  ...
]
```

#### Add Reading
```
POST /sensors/readings
Body:
{
  nodeId: string,
  dustLevel: number,
  pm25: number,
  pm10: number,
  temperature: number,
  humidity: number,
  aqi: number
}
Response: { id, timestamp }
```

### Nodes

#### Get All Nodes
```
GET /nodes
Response:
[
  { id, name, location, status, lastUpdate },
  ...
]
```

#### Get Node Details
```
GET /nodes/{nodeId}
Response: { id, name, location, status, lastUpdate, sensors }
```

#### Register Node
```
POST /nodes
Body:
{
  name: string,
  location: string,
  sensors: string[]
}
Response: { id, apiKey }
```

#### Update Node
```
PUT /nodes/{nodeId}
Body: { name, location, ... }
Response: { id, ... }
```

### Alerts

#### Get All Alerts
```
GET /alerts
Response:
[
  { id, message, severity, timestamp, acknowledged },
  ...
]
```

#### Get Thresholds
```
GET /alerts/thresholds
Response:
{
  dustLevel: number,
  pm25: number,
  pm10: number,
  temperature: { min, max },
  humidity: { min, max }
}
```

#### Update Thresholds
```
PUT /alerts/thresholds
Body: { dustLevel, pm25, ... }
Response: { success: true }
```

#### Create Alert
```
POST /alerts
Body:
{
  message: string,
  severity: "info" | "warning" | "danger",
  nodeId: string
}
Response: { id, timestamp }
```

#### Acknowledge Alert
```
PUT /alerts/{alertId}/acknowledge
Response: { success: true }
```

### Authentication

#### Login
```
POST /auth/login
Body: { email, password }
Response: { token, user }
```

#### Register
```
POST /auth/register
Body: { email, password, name }
Response: { token, user }
```

#### Get Current User
```
GET /auth/me
Response: { id, email, name }
```

## Sample Backend Implementation

### Node.js/Express Example

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware for auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify token...
  next();
};

// Routes
app.get('/api/sensors/readings', authMiddleware, (req, res) => {
  // Return latest sensor data
  res.json({ dustLevel: 150, pm25: 25, ... });
});

app.post('/api/sensors/readings', authMiddleware, (req, res) => {
  // Store sensor reading
  const { dustLevel, pm25, ... } = req.body;
  // Save to database...
  res.json({ id: '123', timestamp: new Date().toISOString() });
});

// More routes...

app.listen(3000, () => console.log('Server running on port 3000'));
```

## MQTT Alternative

If you prefer MQTT for real-time data:

```javascript
// In backend, subscribe to:
mosquitto_sub -t airguard/+/sensors

// Hardware publishes:
mosquitto_pub -t airguard/esp32-01/sensors -m '{"dustLevel":150,"pm25":25,...}'

// Backend stores to database and serves via REST API
```

## Database Schema (Suggested)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Nodes Table
```sql
CREATE TABLE nodes (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  location VARCHAR(255),
  api_key VARCHAR(255),
  status VARCHAR(20),
  last_update TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Readings Table
```sql
CREATE TABLE readings (
  id UUID PRIMARY KEY,
  node_id VARCHAR(50) REFERENCES nodes(id),
  dust_level FLOAT,
  pm25 FLOAT,
  pm10 FLOAT,
  temperature FLOAT,
  humidity FLOAT,
  aqi INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Alerts Table
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  node_id VARCHAR(50) REFERENCES nodes(id),
  message VARCHAR(255),
  severity VARCHAR(20),
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```
