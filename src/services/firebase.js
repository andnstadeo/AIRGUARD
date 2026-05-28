// Firebase Configuration
// Update these with your Firebase project credentials

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: process.env.VITE_FIREBASE_APP_ID || 'your-app-id',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export default app
