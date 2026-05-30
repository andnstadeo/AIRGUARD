// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBdARnznHY9WslIylHK3qN3WSN4GNQIn2U",
  authDomain: "airguard-es.firebaseapp.com",
  projectId: "airguard-es",
  storageBucket: "airguard-es.firebasestorage.app",
  messagingSenderId: "109009704918",
  appId: "1:109009704918:web:75094c024d9c2e4a2e7677"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico' // Ensure you have an icon here!
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});