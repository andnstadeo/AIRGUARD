# AIRGUARD - Project Structure Guide

## Directory Organization

```
AIRGUARD/
│
├── backend/                 # Backend API (Node.js)
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express server entrypoint
│
├── 📄 Configuration Files
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.js         # Vite build configuration
│   ├── tailwind.config.js     # Tailwind CSS theme
│   ├── postcss.config.js      # PostCSS plugins
│   ├── .eslintrc.json         # Code quality rules
│   ├── .env.example           # Environment variables template
│   ├── .gitignore             # Git ignore rules
│   └── index.html             # HTML entry point
│
├── 📚 Documentation
│   ├── README.md              # Main documentation
│   ├── QUICK_START.md         # Quick reference guide
│   ├── HARDWARE_INTEGRATION.md # Hardware setup guide
│   └── PROJECT_STRUCTURE.md   # This file
│
└── 📦 src/
   ├── main.js                # Application entry point
   ├── App.vue                # Root component
   │
   ├── 🎨 components/         # Reusable Vue components
   │   ├── Header.vue         # Top navigation bar
   │   ├── AQIGauge.vue       # AQI circular gauge
   │   ├── SensorCard.vue     # Sensor data display card
   │   ├── SimpleChart.vue    # Chart component
   │   ├── AlertHistory.vue   # Alert list panel
   │   └── SettingsPanel.vue  # Settings/configuration panel
   │
   ├── 📄 pages/              # Full page components
   │   ├── Dashboard.vue      # Main dashboard page
   │   └── Login.vue          # Authentication page
   │
   ├── 💾 stores/             # Pinia state management
   │   ├── sensorStore.js     # Sensor data state
   │   └── alertStore.js      # Alert management state
   │
   ├── 🔌 services/           # API & external services
   │   ├── api.js             # Backend API client
   │   ├── firebase.js        # Firebase configuration
   │   └── hardwareSimulator.js # Mock hardware data
   │
   ├── 🎨 styles/            # Global styles
   │   └── index.css          # TailwindCSS & custom CSS
   │
   └── 🎯 utils/              # Utility functions (ready for expansion)
```

## Component Communication Flow

```
App.vue (Root)
    └── Dashboard.vue (Main Page)
        ├── Header.vue (Navigation)
        ├── SensorCard.vue (Multiple instances)
        ├── AQIGauge.vue (AQI Display)
        ├── SimpleChart.vue (Data visualization)
        ├── AlertHistory.vue (Alert list)
        └── SettingsPanel.vue (Modal)
```

## Data Flow Architecture

```
┌─────────────────────────────────────┐
│   Hardware / Mock Simulator         │
│   (src/services/hardwareSimulator)  │
└────────────────┬────────────────────┘
                 │ generateData()
┌────────────────▼────────────────────┐
│   Pinia Store (State Management)    │
│   - sensorStore.js                  │
│   - alertStore.js                   │
└────────────────┬────────────────────┘
                 │ updateSensorData()
┌────────────────▼────────────────────┐
│   Vue Components (UI)               │
│   - Dashboard, Cards, Charts        │
└─────────────────────────────────────┘
```

## Store Structure

### sensorStore.js
- `sensorData` - Current sensor readings
- `chartData` - Historical data for charts
- `isConnected` - Connection status
- `currentNode` - Active sensor node
- `aqiStatus` - Computed AQI status
- `updateSensorData()` - Update readings
- `setConnected()` - Set connection status

### alertStore.js
- `alerts` - Array of active alerts
- `alertThresholds` - Alert trigger thresholds
- `addAlert()` - Create new alert
- `deleteAlert()` - Remove alert
- `updateThresholds()` - Change thresholds

## Service Structure

### api.js
```javascript
sensorAPI.getReadings()      // Get latest data
sensorAPI.getHistoricalData() // Get historical data
nodeAPI.getAllNodes()         // Get registered nodes
alertAPI.getAllAlerts()       // Get alerts
authAPI.login()              // Authenticate user
```

### hardwareSimulator.js
```javascript
hwSimulator.generateData()    // Generate simulated readings
hwSimulator.setBaseData()     // Change base values
hwSimulator.start/stop()      // Control simulation
```

### firebase.js
Firebase authentication setup

## Key Technologies

- **Vue 3** - Reactive UI framework
- **Vite** - Fast build tool
- **Pinia** - State management
- **TailwindCSS** - Utility-first CSS
- **Axios** - HTTP client
- **Firebase** - Authentication service

## Adding New Features

### Add a New Component

1. Create `src/components/YourComponent.vue`
2. Import in parent component
3. Add to template

```vue
<template>
  <YourComponent :prop="value" @event="handler" />
</template>

<script setup>
import YourComponent from '@/components/YourComponent.vue'
</script>
```

### Add a New Page

1. Create `src/pages/YourPage.vue`
2. Add route handling (currently using simple path checking)
3. Link from navigation

### Add to State

1. Update `src/stores/sensorStore.js` or `src/stores/alertStore.js`
2. Use in components with `const store = useSensorStore()`

### Connect to Backend

1. Add endpoint in `src/services/api.js`
2. Update `.env.local` with correct URL
3. Use in component with try/catch

```javascript
try {
  const response = await sensorAPI.getReadings()
  sensorStore.updateSensorData(response.data)
} catch (error) {
  console.error('API error:', error)
}
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `AQIGauge.vue`)
- **Stores**: camelCase with Store suffix (e.g., `sensorStore.js`)
- **Services**: camelCase (e.g., `hardwareSimulator.js`)
- **Utils**: camelCase (e.g., `formatDate.js`)
- **CSS Classes**: kebab-case (e.g., `badge-success`)

## Development Workflow

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Make changes** (auto-reloads)
   - Edit components, stores, styles
   - Changes appear instantly

3. **Check for issues**
   ```bash
   npm run lint
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

Access in code:
```javascript
import.meta.env.VITE_API_URL
```

## Performance Considerations

- ✅ Charts use canvas (fast rendering)
- ✅ Components are lazy-loaded when needed
- ✅ State is centralized with Pinia
- ✅ Tailwind CSS is optimized in production build
- ⚠️ Real-time updates every 2 seconds (configurable)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari 15+, Chrome Mobile)

## Deployment Checklist

- [ ] Update `.env.local` with production backend URL
- [ ] Build: `npm run build`
- [ ] Test: `npm run preview`
- [ ] Deploy `dist/` folder
- [ ] Configure CORS on backend
- [ ] Set up SSL/HTTPS
- [ ] Test all features in production

---

**Happy coding! 🚀**
