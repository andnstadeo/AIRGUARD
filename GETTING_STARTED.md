# ⚡ AIRGUARD - Get Started in 5 Minutes

## 🎯 Option 1: Quickest Way (Windows)

### Step 1: Open Command Prompt
Press `Win + R`, type `cmd`, and press Enter

### Step 2: Navigate to Project
```cmd
cd "C:\Users\Denise\Desktop\New folder\AIRGUARD"
```

### Step 3: Run Setup
```cmd
setup.bat
```

Done! Your browser should open automatically to the dashboard.

---

## 🐧 Option 2: macOS/Linux

### Step 1: Open Terminal

### Step 2: Navigate to Project
```bash
cd ~/Desktop/"New folder"/AIRGUARD
```

### Step 3: Make Setup Executable
```bash
chmod +x setup.sh
```

### Step 4: Run Setup
```bash
./setup.sh
```

---

## 🔧 Manual Setup (All Platforms)

### Prerequisites Check
```bash
# Install Node.js from https://nodejs.org if needed
node --version
npm --version
```

### Installation
```bash
# Navigate to project
cd AIRGUARD

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

### Open in Browser
```
http://localhost:5173
```

---

## 🔓 Login

**Demo User:**
- Email: `demo@airguard.com`
- Password: `demo1234`

Or click **"Demo Login"** button

---

## 🎨 What You'll See

```
┌─────────────────────────────────────────────────┐
│  🛡️ AIRGUARD | Connected | Settings ⚙️         │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Dust Level  🌫️ PM2.5  🌡️ Temperature  💧 RH│
│   150 µg/m³     25 µg/m³      22°C         45% │
│                                                 │
│  ┌─────────────────┬────────────────────────┐  │
│  │   AQI Gauge     │   PM2.5 Trend Chart    │  │
│  │       85        │   [████████████]       │  │
│  │  Moderate ⚠️    │   Recent Alerts        │  │
│  └─────────────────┴────────────────────────┘  │
│                                                 │
│  🔋 Hardware Status                             │
│  Connected Nodes: 1 | Signal: 95% | Live Data  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Includes

✅ **Beautiful Dashboard**
- Real-time sensor display
- Circular AQI gauge
- Historical charts
- Alert history

✅ **State Management**
- Pinia for reactive data
- Centralized store
- Easy to extend

✅ **Mock Hardware**
- Realistic data generation
- No backend required to start
- Great for testing UI

✅ **Production Ready**
- Optimized build
- Code splitting
- CSS optimization

✅ **Complete Documentation**
- Setup guides
- API specifications
- Hardware integration
- Troubleshooting

---

## 🔌 Connect Real Hardware

Currently using **simulated data**. When ready to connect real hardware:

### 1. Create Backend API
- Set up Node.js server
- Create database
- Implement API endpoints

### 2. Flash ESP32
- Install Arduino IDE
- Upload firmware to ESP32
- Configure WiFi

### 3. Update Frontend
```env
# In .env.local
VITE_API_URL=http://your-backend:3000/api
```

**See:** [HARDWARE_INTEGRATION.md](HARDWARE_INTEGRATION.md)

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Create optimized build
npm run preview      # Preview production build

# Quality
npm run lint         # Check code quality
```

---

## ⚙️ Configuration

Edit `.env.local` (copy from `.env.example`):

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Firebase (optional, for authentication)
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🎯 What's Working Right Now

| Feature | Status | Details |
|---------|--------|---------|
| Dashboard UI | ✅ Live | Beautiful, responsive design |
| Sensor Cards | ✅ Live | Display real/simulated data |
| AQI Gauge | ✅ Live | Circular gauge visualization |
| Charts | ✅ Live | PM2.5 trend over time |
| Alerts | ✅ Live | Threshold-based notifications |
| Settings | ✅ Live | Configurable thresholds |
| Authentication | ✅ Demo | Demo login enabled |
| Hardware Simulator | ✅ Live | Generates realistic data |
| Responsive Design | ✅ Live | Works on desktop/tablet/mobile |

---

## ❌ What Needs Backend

These features require your backend API:

- Real sensor data from hardware
- Data persistence/history
- Multi-user support
- Firebase authentication
- Email alerts
- Data export

---

## 🐛 Troubleshooting

### "Port 5173 already in use"
```bash
npm run dev -- --port 3000
```

### "Can't find node or npm"
- Download Node.js: https://nodejs.org
- Restart terminal after install
- Run `node --version` to verify

### "Dependencies not installing"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Blank page on localhost:5173"
- Press Ctrl+Shift+R (hard refresh)
- Clear browser cache
- Check console for errors (F12)

### "Looks ugly/styling is broken"
```bash
# Rebuild Tailwind CSS
npm run dev
# Wait 10 seconds for Tailwind to process
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Full project documentation |
| [QUICK_START.md](QUICK_START.md) | Quick reference |
| [HARDWARE_INTEGRATION.md](HARDWARE_INTEGRATION.md) | Hardware setup guide |
| [BACKEND_API_SPEC.md](BACKEND_API_SPEC.md) | API requirements |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Code organization |

---

## 🚀 Next Steps

1. **✅ Start dev server** - You're here!
2. **🔨 Explore the code** - Open `src/` folder
3. **🎨 Customize styling** - Edit TailwindCSS config
4. **💾 Connect backend** - Implement your API
5. **🔌 Add real hardware** - Flash ESP32
6. **📦 Build for production** - Deploy!

---

## 💡 Pro Tips

- Hot reload is enabled - changes save instantly
- Use F12 to open browser developer tools
- Check Console tab for error messages
- Network tab shows all API calls
- Application tab shows localStorage/cookies
- Settings are saved in browser localStorage

---

## 🎓 Learning Resources

- **Vue 3**: https://vuejs.org/guide/
- **Vite**: https://vitejs.dev/guide/
- **TailwindCSS**: https://tailwindcss.com/docs/
- **Pinia**: https://pinia.vuejs.org/
- **Firebase**: https://firebase.google.com/docs

---

## 🤝 Need Help?

1. Check the troubleshooting section above
2. Look in browser console (F12) for error messages
3. Review the relevant documentation file
4. Check if backend/hardware is running (if needed)

---

## ✨ You're All Set!

```
npm run dev
```

Enjoy building AIRGUARD! 🎉

Questions? Check the documentation files or your browser console for helpful error messages.
