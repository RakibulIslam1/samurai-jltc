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
  phone: string
  educationLevel: string
  instituteName: string
  addressPrimary: string
  addressSecondary: string
  profilePhotoDataUrl: string
  createdAt?: number
  updatedAt?: number
}

type AuthContextType = {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  adminEmails: string[]
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (
    fullName: string,
    email: string,
    password: string,
    educationLevel: string,
    instituteName: string,
  ) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (profile: UserProfile) => Promise<void>
  grantAdminAccess: (email: string) => Promise<void>
  revokeAdminAccess: (email: string) => Promise<void>
}

const SUPER_ADMIN_EMAIL =
  (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'rakibul.rir06@gmail.com').trim().toLowerCase()
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
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminEmails, setAdminEmails] = useState<string[]>(SUPER_ADMIN_EMAIL ? [SUPER_ADMIN_EMAIL] : [])

  const ensureProfileDoc = async (uid: string, nextProfile: UserProfile) => {
    const db = getFirestoreDb()
    if (!db) return

    await setDoc(
      doc(db, 'profiles', uid),
      {
        ...nextProfile,
        updatedAt: Date.now(),
      },
      { merge: true },
    )
  }

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth()
    if (!firebaseAuth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser?.email) {
        setUser(null)
        setProfile(null)
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

        const baseProfile: UserProfile = {
          fullName: syncedUser.fullName,
          email: syncedUser.email,
          phone: '',
          educationLevel: '',
          instituteName: '',
          addressPrimary: '',
          addressSecondary: '',
          profilePhotoDataUrl: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        if (!profileSnap?.exists()) {
          await setDoc(profileRef, baseProfile, { merge: true }).catch(() => undefined)
          setProfile(baseProfile)
        } else {
          const data = profileSnap.data() as Partial<UserProfile>
          setProfile({
            fullName: data.fullName || syncedUser.fullName,
            email: data.email || syncedUser.email,
            phone: data.phone || '',
            educationLevel: data.educationLevel || '',
            instituteName: data.instituteName || '',
            addressPrimary: data.addressPrimary || '',
            addressSecondary: data.addressSecondary || '',
            profilePhotoDataUrl: data.profilePhotoDataUrl || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          })
        }

        const storedAdminEmails = normalizeEmails(adminRolesSnap?.data()?.emails)
        const nextAdminEmails = Array.from(new Set([SUPER_ADMIN_EMAIL, ...storedAdminEmails].filter(Boolean)))
        setAdminEmails(nextAdminEmails)
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
      try {
        const nextProfile: UserProfile = {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: '',
          educationLevel: educationLevel.trim(),
          instituteName: instituteName.trim(),
          addressPrimary: '',
          addressSecondary: '',
          profilePhotoDataUrl: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        await setDoc(doc(db, 'profiles', credential.user.uid), nextProfile, { merge: true })
        setProfile(nextProfile)
      } catch (error) {
        const code =
          typeof error === 'object' && error !== null && 'code' in error
            ? String((error as { code?: unknown }).code || '')
            : ''
        const message = error instanceof Error ? error.message.toLowerCase() : ''
        const permissionDenied =
          code === 'permission-denied' ||
          code === 'firestore/permission-denied' ||
          message.includes('missing or insufficient permissions')

        if (!permissionDenied) {
          throw error
        }

        // Auth account is already created; continue sign-up and let admin update rules.
        console.warn('[AuthProvider] Firestore profile write blocked by rules.')
      }
    }
  }

  const signOut = async () => {
    const firebaseAuth = getFirebaseAuth()
    setUser(null)
    setProfile(null)
    if (firebaseAuth) {
      await firebaseSignOut(firebaseAuth)
    }
  }

  const updateUserProfile = async (nextProfile: UserProfile) => {
    if (!user) {
      throw new Error('You must be signed in to update profile.')
    }

    await ensureProfileDoc(user.id, {
      ...nextProfile,
      fullName: nextProfile.fullName.trim(),
      email: nextProfile.email.trim(),
      phone: nextProfile.phone.trim(),
      educationLevel: nextProfile.educationLevel.trim(),
      instituteName: nextProfile.instituteName.trim(),
      addressPrimary: nextProfile.addressPrimary.trim(),
      addressSecondary: nextProfile.addressSecondary.trim(),
    })

    setProfile({ ...nextProfile, updatedAt: Date.now() })
    setUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        fullName: nextProfile.fullName.trim() || prev.fullName,
        email: nextProfile.email.trim() || prev.email,
      }
    })
  }

  const grantAdminAccess = async (email: string) => {
    if (!user?.email || user.email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
      throw new Error('Only super admin can add admin users.')
    }

    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      throw new Error('Admin email is required.')
    }

    const db = getFirestoreDb()
    if (!db) {
      throw new Error('Firestore is not configured.')
    }

    const nextAdmins = Array.from(new Set([SUPER_ADMIN_EMAIL, ...adminEmails, normalized].filter(Boolean)))
    await setDoc(doc(db, 'adminSettings', ADMIN_ROLES_DOC), { emails: nextAdmins, updatedAt: Date.now() }, { merge: true })
    setAdminEmails(nextAdmins)
  }

  const revokeAdminAccess = async (email: string) => {
    if (!user?.email || user.email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
      throw new Error('Only super admin can remove admin users.')
    }

    const normalized = email.trim().toLowerCase()
    if (!normalized || normalized === SUPER_ADMIN_EMAIL) {
      throw new Error('Super admin access cannot be removed.')
    }

    const db = getFirestoreDb()
    if (!db) {
      throw new Error('Firestore is not configured.')
    }

    const nextAdmins = adminEmails.filter((value) => value !== normalized)
    await setDoc(doc(db, 'adminSettings', ADMIN_ROLES_DOC), { emails: nextAdmins, updatedAt: Date.now() }, { merge: true })
    setAdminEmails(nextAdmins)
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
        profile,
        loading,
        isAdmin,
        isSuperAdmin,
        adminEmails,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateUserProfile,
        grantAdminAccess,
        revokeAdminAccess,
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
