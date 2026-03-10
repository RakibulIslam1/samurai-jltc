import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let authInstance: Auth | null = null
let firestoreInstance: Firestore | null = null

function hasRequiredConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  )
}

function getClientApp() {
  if (!hasRequiredConfig()) return null
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth() {
  if (typeof window === 'undefined') return null
  if (authInstance) return authInstance

  const app = getClientApp()
  if (!app) return null

  authInstance = getAuth(app)
  return authInstance
}

export function getFirestoreDb() {
  if (typeof window === 'undefined') return null
  if (firestoreInstance) return firestoreInstance

  const app = getClientApp()
  if (!app) return null

  firestoreInstance = getFirestore(app)
  return firestoreInstance
}
