'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'

type UserRow = {
  uid: string
  fullName: string
  email: string
  educationLevel: string
  instituteName: string
  createdAt?: number
}

export default function AdminPage() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const [rows, setRows] = useState<UserRow[]>([])
  const [loadingRows, setLoadingRows] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading || !user || !isAdmin) return

    const loadUsers = async () => {
      setLoadingRows(true)
      setError('')

      try {
        const db = getFirestoreDb()
        if (!db) {
          setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
          return
        }

        const snap = await getDocs(collection(db, 'profiles'))
        const items = snap.docs
          .map((docItem) => {
            const data = docItem.data() as Partial<UserRow>
            return {
              uid: docItem.id,
              fullName: data.fullName || '-',
              email: data.email || '-',
              educationLevel: data.educationLevel || '-',
              instituteName: data.instituteName || '-',
              createdAt: data.createdAt,
            }
          })
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

        setRows(items)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load users.')
      } finally {
        setLoadingRows(false)
      }
    }

    void loadUsers()
  }, [isAdmin, loading, user])

  const totalUsers = useMemo(() => rows.length, [rows])

  if (loading) {
    return <section className="px-4 py-20 text-center text-gray-600">Checking access...</section>
  }

  if (!user) {
    return (
      <section className="px-4 py-20 text-center">
        <h1 className="section-heading">Sign In Required</h1>
        <p className="text-gray-600 mb-6">Please sign in to continue.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="px-4 py-20 text-center">
        <h1 className="section-heading">Admin Access Required</h1>
        <p className="text-gray-600 mb-6">Your account does not have admin permission yet.</p>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-heading mb-1">Admin Panel</h1>
          <p className="text-gray-600">User Data Overview: {totalUsers} registered users.</p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="btn-secondary"
        >
          Sign Out
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-secondary">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Education</th>
              <th className="px-4 py-3 font-semibold">Institute</th>
            </tr>
          </thead>
          <tbody>
            {loadingRows && (
              <tr>
                <td className="px-4 py-6 text-gray-600" colSpan={4}>
                  Loading users...
                </td>
              </tr>
            )}
            {!loadingRows && rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-600" colSpan={4}>
                  No user profile data found yet.
                </td>
              </tr>
            )}
            {!loadingRows &&
              rows.map((row) => (
                <tr key={row.uid} className="border-t border-gray-100">
                  <td className="px-4 py-3">{row.fullName}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.educationLevel}</td>
                  <td className="px-4 py-3">{row.instituteName}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
