# AIRGUARD - Quick Reference

## 🚀 Start Development

```bash
# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173

**Demo Credentials:**
- Email: demo@airguard.com
- Password: demo1234

## 📁 Key Files to Modify

### Add New Component
Create file in `src/components/YourComponent.vue`

### Add New Page
Create file in `src/pages/YourPage.vue`

### Modify State
Edit `src/stores/sensorStore.js` or `src/stores/alertStore.js`

### Connect to Backend
Update `src/services/api.js` with your endpoints

### Change Styling
Edit `tailwind.config.js` or add CSS to `src/styles/index.css`

## 🔧 Configuration

Edit `.env.local`:
```env
VITE_API_URL=http://your-backend:3000/api
VITE_FIREBASE_API_KEY=your_key_here
```

## 📦 Build for Production

```bash
npm run build
```

Creates `dist/` folder ready to deploy.

## 🛠️ Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |

## 🎨 Component Structure

Each component has:
- `<template>` - HTML UI
- `<script setup>` - Vue 3 Composition API
- `<style scoped>` - Component styles

Example:
```vue
<template>
  <div class="card p-6">
    <h3>{{ title }}</h3>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: String
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-md;
}
</style>
```

## 🔌 Real-Time Data

Data updates every 2 seconds from:
1. **Simulator** (current) - `src/services/hardwareSimulator.js`
2. **Backend API** (when ready) - `src/services/api.js`

To switch: Edit `src/pages/Dashboard.vue` `onMounted()` section

## 💾 State Management

Use Pinia stores for reactive data:

```javascript
import { useSensorStore } from '@/stores/sensorStore'

const store = useSensorStore()
store.updateSensorData(newData)
console.log(store.sensorData)
```

## 🐛 Debugging

Press `F12` to open developer tools:
- Console: Check for errors
- Network: See API calls
- Application: Check localStorage

## 📚 Documentation

- [Main README](README.md)
- Backend API: see the `backend/` folder or `HARDWARE_INTEGRATION.md`
- [Hardware Integration](HARDWARE_INTEGRATION.md)
- [Vue.js Docs](https://vuejs.org)

## ❓ Common Issues

**Port in use?**
```bash
npm run dev -- --port 3000
```

**CSS not loading?**
```bash
# Rebuild Tailwind
npm run dev
```

**API not working?**
- Check `.env.local` API URL
- Verify backend is running
- Check browser console for CORS errors

**Components not showing?**
- Verify component is imported in parent
- Check template syntax
- Look for console errors

---

**Need help?** Check the README.md for detailed instructions!
