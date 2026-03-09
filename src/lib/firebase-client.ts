import { initializeApp, getApps, getApp as _getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return _getApp()
  return initializeApp(getFirebaseConfig())
}

export function getClientAuth(): Auth {
  return getAuth(getFirebaseApp())
}

export function getClientDb(): Firestore {
  return getFirestore(getFirebaseApp())
}
