# AIRGUARD - IoT-Based Dust Level Monitoring System

A web dashboard for real-time indoor air quality monitoring. Built with Vue.js 3, Vite, and TailwindCSS.

## 📋 Project Overview

AIRGUARD is a comprehensive IoT solution for monitoring indoor air quality through dust level sensors. 

- 🎯 Real-time AQI (Air Quality Index) gauge
- 📊 Live sensor data visualization
- 📈 Historical data charts
- 🚨 Smart alert management
- 🔔 Threshold-based notifications
- 🎨 Responsive UI
- 🔐 Firebase authentication support

---

## 🚀 Setup Instructions

### Step 1: Install Prerequisites

Before you begin, make sure you have the following installed on your computer:

#### **Node.js & npm** (REQUIRED)
This is the main package manager and JavaScript runtime you need.

**Download from**: https://nodejs.org/

**Choose**: LTS (Long Term Support) version or latest stable version

**Verify Installation**:
```bash
node --version
npm --version
```

#### **Git** (Optional but recommended)
For cloning and version control.

**Download from**: https://git-scm.com/

**Verify Installation**:
```bash
git --version
```

---

### Step 2: Clone or Download the Repository

**Option A: Using Git** (Recommended)
```bash
git clone https://github.com/your-username/AIRGUARD.git
cd AIRGUARD
```

**Option B: Download ZIP**
1. Click "Code" → "Download ZIP"
2. Extract the folder
3. Open terminal in the extracted folder

---

### Step 3: Install Project Dependencies

Navigate to the project directory and install all required packages:

```bash
npm install
```

This will install all 217 packages listed in `package.json`, including:
- **vue** (v3.3.4) - UI framework
- **vite** (v4.4.8) - Build tool
- **tailwindcss** (v3.3.2) - CSS framework
- **pinia** (v2.1.6) - State management
- **axios** (v1.4.0) - HTTP client
- **firebase** (v10.0.0) - Authentication (optional)
- And 211 more packages...

**Note**: If you get dependency conflicts, use:
```bash
npm install --legacy-peer-deps
```

---

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
VITE v4.4.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

The browser will **automatically open** at `http://localhost:5173/`

---

### Step 5: Login to Dashboard

**Demo Credentials**:
```
Email: demo@airguard.com
Password: demo1234
```

Or click the **"Demo Login"** button

---

## 📦 Packages & Dependencies

### Main Technologies Included

| Package | Version | Purpose |
|---------|---------|---------|
| vue | 3.3.4 | Reactive UI framework |
| vite | 4.4.8 | Build tool & dev server |
| tailwindcss | 3.3.2 | CSS styling |
| pinia | 2.1.6 | State management |
| axios | 1.4.0 | HTTP requests |
| firebase | 10.0.0 | Authentication |
| postcss | 8.4.27 | CSS processing |
| autoprefixer | 10.4.14 | CSS vendor prefixes |

### Total Packages
**217 packages** including all dependencies and dev dependencies

### Installation Size
```
node_modules/: ~500MB
dist/ (production build): ~200KB
```

---

## 🚀 Available Commands

After installation, you can use these commands:

```bash
# Development - Start dev server with hot reload
npm run dev

# Production - Build optimized files for deployment
npm run build

# Preview - Test production build locally
npm run preview

# Code Quality - Check for code issues
npm run lint
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file (copy from `.env.example`):

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Firebase (optional)
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 📁 Project Structure

```
AIRGUARD/
├── backend/                 # Backend API (Node.js)
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Simple Express server entrypoint
├── src/
│   ├── components/          # Reusable Vue components (6 files)
│   ├── pages/               # Full page components (2 files)
│   ├── stores/              # Pinia state management (3 files)
│   ├── services/            # API clients & services (3 files)
│   ├── styles/              # Global CSS
│   ├── App.vue              # Root component
│   └── main.js              # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Frontend dependencies (see `backend/package.json` for backend)
├── vite.config.js           # Build configuration
├── tailwind.config.js      # CSS configuration
└── postcss.config.js       # CSS processing
```

---

## 📖 Troubleshooting Installation

### Issue: "Node.js not found"
**Solution**: Install Node.js from https://nodejs.org and restart your terminal

### Issue: "npm command not found" (Mac/Linux)
**Solution**: 
```bash
# Reinstall Node.js or use:
which node
# Should show path like /usr/local/bin/node
```

### Issue: "Port 5173 already in use"
**Solution**:
```bash
npm run dev -- --port 3000
```

### Issue: "npm install fails"
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try again with legacy flag
npm install --legacy-peer-deps
```

### Issue: "Module not found errors"
**Solution**:
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔌 Quick Start Summary

For the fastest setup:

```bash
# 1. Install Node.js from https://nodejs.org
# 2. Clone the repository
git clone https://github.com/your-username/AIRGUARD.git
cd AIRGUARD

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser: http://localhost:5173
# 6. Login with demo credentials
```

---

## 🔌 Hardware Connection Guide

### Current Implementation (Simulated Data)

The project includes a built-in hardware simulator that generates realistic sensor data. Perfect for:
- UI/UX testing
- Demo purposes
- Development without hardware

### Connecting Real Hardware (ESP32)

When you have your hardware ready, see `HARDWARE_INTEGRATION.md` for:
- ESP32 firmware setup
- Backend API configuration
- Hardware connection steps

---

## 🎨 UI Features

✅ Real-time sensor display
✅ Circular AQI gauge
✅ Historical charts
✅ Alert management
✅ Settings configuration
✅ Responsive design
✅ Demo authentication

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](QUICK_START.md) | Quick reference |
| [HARDWARE_INTEGRATION.md](HARDWARE_INTEGRATION.md) | Hardware setup |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Code organization |
| [GETTING_STARTED.md](GETTING_STARTED.md) | First-time setup |

---

## 🛠️ Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Creates optimized files in `dist/` directory.

### Deploy to Hosting

```bash
# After npm run build, upload dist/ folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Your own server
```

---

## 📋 Requirements Summary

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Disk Space**: ~1GB for node_modules
- **RAM**: 2GB minimum
- **Node.js**: v16 or higher

### Software to Download
1. **Node.js** - https://nodejs.org/ (includes npm)
2. **Git** (optional) - https://git-scm.com/
3. **Code Editor** (optional) - VS Code, Sublime, etc.

---

## 🐛 Support & Troubleshooting

For issues:
1. Check the Troubleshooting section above
2. Review browser console (F12) for error messages
3. Check `.env.local` configuration
4. Verify Node.js and npm versions
5. Read relevant documentation file

---

## 📝 License

Project of Group 3, Section 4-6

---

**Ready to get started?** Follow the Setup Instructions above!

