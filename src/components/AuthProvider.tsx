'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase'

type AuthUser = {
  id: string
  fullName: string
  email: string
}

type UserProfile = {
  fullName: string
  email: string
  educationLevel: string
  instituteName: string
  createdAt: number
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (
    fullName: string,
    email: string,
    password: string,
    educationLevel: string,
    instituteName: string,
  ) => Promise<void>
  signOut: () => Promise<void>
}

const SUPER_ADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || '').trim().toLowerCase()
const ADMIN_ROLES_DOC = 'roles'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeEmails(items: unknown) {
  if (!Array.isArray(items)) return []
  return items
    .filter((item): item is string => typeof item === 'string')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminEmails, setAdminEmails] = useState<string[]>([])

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser?.email) {
        setUser(null)
        setLoading(false)
        return
      }

      const syncedUser: AuthUser = {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
      }

      setUser(syncedUser)

      const db = getFirestoreDb()
      if (db) {
        const profileRef = doc(db, 'profiles', firebaseUser.uid)
        const adminRolesRef = doc(db, 'adminSettings', ADMIN_ROLES_DOC)

        const [profileSnap, adminRolesSnap] = await Promise.all([
          getDoc(profileRef).catch(() => null),
          getDoc(adminRolesRef).catch(() => null),
        ])

        if (!profileSnap?.exists()) {
          const profileDoc: UserProfile = {
            fullName: syncedUser.fullName,
            email: syncedUser.email,
            educationLevel: '',
            instituteName: '',
            createdAt: Date.now(),
          }

          await setDoc(profileRef, profileDoc, { merge: true }).catch(() => undefined)
        }

        const storedAdminEmails = normalizeEmails(adminRolesSnap?.data()?.emails)
        setAdminEmails(storedAdminEmails)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) {
      throw new Error('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables first.')
    }

    await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
  }

  const signUpWithEmail = async (
    fullName: string,
    email: string,
    password: string,
    educationLevel: string,
    instituteName: string,
  ) => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) {
      throw new Error('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables first.')
    }

    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)

    if (firebaseAuth.currentUser) {
      await updateProfile(firebaseAuth.currentUser, { displayName: fullName.trim() })
    }

    const db = getFirestoreDb()
    if (db) {
      await setDoc(
        doc(db, 'profiles', credential.user.uid),
        {
          fullName: fullName.trim(),
          email: email.trim(),
          educationLevel: educationLevel.trim(),
          instituteName: instituteName.trim(),
          createdAt: Date.now(),
        },
        { merge: true },
      )
    }
  }

  const signOut = async () => {
    const firebaseAuth = getFirebaseAuth()
    setUser(null)
    if (firebaseAuth) {
      await firebaseSignOut(firebaseAuth)
    }
  }

  const isSuperAdmin = useMemo(() => {
    return Boolean(user?.email && SUPER_ADMIN_EMAIL && user.email.toLowerCase() === SUPER_ADMIN_EMAIL)
  }, [user])

  const isAdmin = useMemo(() => {
    if (!user?.email) return false
    return isSuperAdmin || adminEmails.includes(user.email.toLowerCase())
  }, [adminEmails, isSuperAdmin, user])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
