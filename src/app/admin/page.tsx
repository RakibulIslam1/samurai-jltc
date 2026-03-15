'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'
import { defaultSiteContactSettings, type SiteContactSettings } from '@/lib/siteContact'

type AdminTab = 'profiles' | 'messages' | 'contact' | 'admins'

type UserRow = {
  uid: string
  fullName: string
  email: string
  educationLevel: string
  instituteName: string
  phone: string
  addressPrimary: string
  addressSecondary: string
  profilePhotoDataUrl: string
  createdAt?: number
}

type ThreadMessage = {
  sender: 'user' | 'admin'
  text: string
  createdAt: number
  senderName?: string
}

type ContactThread = {
  id: string
  userId: string
  name: string
  email: string
  subject: string
  status: string
  updatedAt: number
  createdAt: number
  messages: ThreadMessage[]
}

function toTimestampValue(value: unknown) {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'toMillis' in value) {
    const fn = value.toMillis
    if (typeof fn === 'function') return fn.call(value)
  }
  return Date.now()
}

export default function AdminPage() {
  const { user, loading, isAdmin, isSuperAdmin, adminEmails, grantAdminAccess, revokeAdminAccess, signOut } = useAuth()

  const [activeTab, setActiveTab] = useState<AdminTab>('profiles')
  const [error, setError] = useState('')

  const [profiles, setProfiles] = useState<UserRow[]>([])
  const [profilesLoading, setProfilesLoading] = useState(false)
  const [deletingProfileId, setDeletingProfileId] = useState('')

  const [threads, setThreads] = useState<ContactThread[]>([])
  const [threadsLoading, setThreadsLoading] = useState(false)
  const [activeThreadId, setActiveThreadId] = useState('')
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [deletingThreadId, setDeletingThreadId] = useState('')

  const [contactForm, setContactForm] = useState<SiteContactSettings>(defaultSiteContactSettings)
  const [savingContact, setSavingContact] = useState(false)

  const [adminEmailInput, setAdminEmailInput] = useState('')
  const [adminActionLoading, setAdminActionLoading] = useState(false)

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeThreadId) || null, [threads, activeThreadId])

  const loadProfiles = async () => {
    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    setProfilesLoading(true)
    try {
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
            phone: data.phone || '-',
            addressPrimary: data.addressPrimary || '-',
            addressSecondary: data.addressSecondary || '-',
            profilePhotoDataUrl: data.profilePhotoDataUrl || '',
            createdAt: data.createdAt,
          }
        })
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      setProfiles(items)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load user profiles.')
    } finally {
      setProfilesLoading(false)
    }
  }

  const loadThreads = async () => {
    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    setThreadsLoading(true)
    try {
      const snap = await getDocs(collection(db, 'contactMessages'))
      const items = snap.docs
        .map((docItem) => {
          const data = docItem.data() as Partial<ContactThread>
          return {
            id: docItem.id,
            userId: data.userId || '',
            name: data.name || 'Unknown',
            email: data.email || '-',
            subject: data.subject || 'No subject',
            status: data.status || 'new',
            updatedAt: toTimestampValue(data.updatedAt),
            createdAt: toTimestampValue(data.createdAt),
            messages: Array.isArray(data.messages) ? data.messages : [],
          }
        })
        .sort((a, b) => b.updatedAt - a.updatedAt)

      setThreads(items)
      if (items.length > 0) {
        setActiveThreadId((prev) => prev || items[0].id)
      } else {
        setActiveThreadId('')
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load message threads.')
    } finally {
      setThreadsLoading(false)
    }
  }

  const loadContactSettings = async () => {
    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    try {
      const snap = await getDocs(collection(db, 'siteSettings'))
      const contactDoc = snap.docs.find((item) => item.id === 'contact')
      if (!contactDoc) {
        setContactForm(defaultSiteContactSettings)
        return
      }

      const data = contactDoc.data() as Partial<SiteContactSettings>
      const phones = Array.isArray(data.phones) ? data.phones : []
      setContactForm({
        addressPrimary: data.addressPrimary || defaultSiteContactSettings.addressPrimary,
        addressSecondary: data.addressSecondary || '',
        phones: [phones[0] || '', phones[1] || ''],
        email: data.email || defaultSiteContactSettings.email,
        officeHours: data.officeHours || defaultSiteContactSettings.officeHours,
      })
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load contact settings.')
    }
  }

  useEffect(() => {
    if (loading || !user || !isAdmin) return
    setError('')
    void Promise.all([loadProfiles(), loadThreads(), loadContactSettings()])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id, isAdmin])

  const deleteProfile = async (uid: string) => {
    const db = getFirestoreDb()
    if (!db) return

    setDeletingProfileId(uid)
    setError('')
    try {
      await deleteDoc(doc(db, 'profiles', uid))
      setProfiles((prev) => prev.filter((item) => item.uid !== uid))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete profile.')
    } finally {
      setDeletingProfileId('')
    }
  }

  const sendAdminReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeThread || !replyText.trim() || !user) return

    const db = getFirestoreDb()
    if (!db) return

    setIsReplying(true)
    setError('')
    try {
      const nextMessages = [
        ...(activeThread.messages || []),
        {
          sender: 'admin' as const,
          text: replyText.trim(),
          createdAt: Date.now(),
          senderName: user.fullName,
        },
      ]

      await setDoc(
        doc(db, 'contactMessages', activeThread.id),
        {
          messages: nextMessages,
          status: 'open',
          updatedAt: Date.now(),
          serverUpdatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      setReplyText('')
      await loadThreads()
    } catch (replyError) {
      setError(replyError instanceof Error ? replyError.message : 'Failed to send admin reply.')
    } finally {
      setIsReplying(false)
    }
  }

  const deleteThread = async (threadId: string) => {
    const db = getFirestoreDb()
    if (!db) return

    setDeletingThreadId(threadId)
    setError('')
    try {
      await deleteDoc(doc(db, 'contactMessages', threadId))
      const nextThreads = threads.filter((item) => item.id !== threadId)
      setThreads(nextThreads)
      if (activeThreadId === threadId) {
        setActiveThreadId(nextThreads[0]?.id || '')
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete message thread.')
    } finally {
      setDeletingThreadId('')
    }
  }

  const saveContactSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const db = getFirestoreDb()
    if (!db) return

    setSavingContact(true)
    setError('')
    try {
      const phones = [contactForm.phones[0] || '', contactForm.phones[1] || ''].map((value) => value.trim())
      await setDoc(
        doc(db, 'siteSettings', 'contact'),
        {
          addressPrimary: contactForm.addressPrimary.trim(),
          addressSecondary: contactForm.addressSecondary.trim(),
          phones,
          email: contactForm.email.trim(),
          officeHours: contactForm.officeHours.trim(),
          updatedAt: Date.now(),
          serverUpdatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save contact settings.')
    } finally {
      setSavingContact(false)
    }
  }

  const addAdmin = async () => {
    if (!adminEmailInput.trim()) return
    setAdminActionLoading(true)
    setError('')
    try {
      await grantAdminAccess(adminEmailInput)
      setAdminEmailInput('')
    } catch (adminError) {
      setError(adminError instanceof Error ? adminError.message : 'Failed to add admin.')
    } finally {
      setAdminActionLoading(false)
    }
  }

  const removeAdmin = async (email: string) => {
    setAdminActionLoading(true)
    setError('')
    try {
      await revokeAdminAccess(email)
    } catch (adminError) {
      setError(adminError instanceof Error ? adminError.message : 'Failed to remove admin.')
    } finally {
      setAdminActionLoading(false)
    }
  }

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
        <p className="text-gray-600 mb-2">Your account does not have admin permission yet.</p>
        <p className="text-sm text-gray-500 mb-6">
          Signed in as: <span className="font-semibold">{user.email}</span>
        </p>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-heading mb-1">Admin Panel</h1>
          <p className="text-gray-600">Manage profiles, chats, contact settings, and admin access.</p>
        </div>
        <button type="button" onClick={() => void signOut()} className="btn-secondary">
          Sign Out
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveTab('profiles')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'profiles' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
          Profiles
        </button>
        <button type="button" onClick={() => setActiveTab('messages')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'messages' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
          Messages
        </button>
        <button type="button" onClick={() => setActiveTab('contact')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'contact' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
          Contact Settings
        </button>
        {isSuperAdmin && (
          <button type="button" onClick={() => setActiveTab('admins')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'admins' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
            Admin Access
          </button>
        )}
      </div>

      {activeTab === 'profiles' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Photo</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Education</th>
                <th className="px-4 py-3 font-semibold">Institute</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {profilesLoading && (
                <tr>
                  <td className="px-4 py-6 text-gray-600" colSpan={7}>
                    Loading profiles...
                  </td>
                </tr>
              )}
              {!profilesLoading && profiles.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-600" colSpan={7}>
                    No user profile data found yet.
                  </td>
                </tr>
              )}
              {!profilesLoading && profiles.map((profile) => (
                <tr key={profile.uid} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3">
                    {profile.profilePhotoDataUrl ? (
                      <img src={profile.profilePhotoDataUrl} alt={profile.fullName} className="h-12 w-12 rounded-full border border-gray-200 object-cover" />
                    ) : (
                      <span className="text-xs text-red-600">Missing photo</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{profile.fullName}</td>
                  <td className="px-4 py-3">{profile.email}</td>
                  <td className="px-4 py-3">{profile.phone}</td>
                  <td className="px-4 py-3">{profile.educationLevel}</td>
                  <td className="px-4 py-3">{profile.instituteName}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-70"
                      disabled={deletingProfileId === profile.uid}
                      onClick={() => {
                        if (window.confirm(`Delete profile for ${profile.email}?`)) {
                          void deleteProfile(profile.uid)
                        }
                      }}
                    >
                      {deletingProfileId === profile.uid ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-secondary">All Conversations</h2>
            {threadsLoading && <p className="text-sm text-gray-600">Loading messages...</p>}
            {!threadsLoading && threads.length === 0 && <p className="text-sm text-gray-600">No conversations found.</p>}
            <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${activeThreadId === thread.id ? 'border-primary bg-red-50' : 'border-gray-200 bg-white'}`}
                >
                  <p className="font-semibold text-secondary line-clamp-1">{thread.subject || 'No subject'}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">{thread.name} • {thread.email}</p>
                  <p className="text-xs text-gray-500">{new Date(thread.updatedAt).toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {!activeThread ? (
              <p className="text-sm text-gray-600">Select a conversation to view and reply.</p>
            ) : (
              <>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-secondary">{activeThread.subject || 'No subject'}</h3>
                    <p className="text-xs text-gray-600">{activeThread.name} ({activeThread.email})</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-70"
                    disabled={deletingThreadId === activeThread.id}
                    onClick={() => {
                      if (window.confirm('Delete this message thread?')) {
                        void deleteThread(activeThread.id)
                      }
                    }}
                  >
                    {deletingThreadId === activeThread.id ? 'Deleting...' : 'Delete Thread'}
                  </button>
                </div>

                <div className="max-h-[420px] space-y-2 overflow-auto rounded-lg border border-gray-100 bg-gray-50 p-3">
                  {(activeThread.messages || []).map((message, index) => (
                    <div
                      key={`${message.createdAt}-${index}`}
                      className={`rounded-lg px-3 py-2 text-sm ${message.sender === 'admin' ? 'bg-green-50 text-green-900' : 'bg-white text-secondary'}`}
                    >
                      <p className="mb-1 text-xs font-semibold">{message.sender === 'admin' ? 'Admin' : 'User'}</p>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendAdminReply} className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder="Write admin reply..."
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={isReplying}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
                  >
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-secondary">Contact Information</h2>
          <form onSubmit={saveContactSettings} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              required
              value={contactForm.addressPrimary}
              onChange={(event) => setContactForm((prev) => ({ ...prev, addressPrimary: event.target.value }))}
              placeholder="Address 1"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={contactForm.addressSecondary}
              onChange={(event) => setContactForm((prev) => ({ ...prev, addressSecondary: event.target.value }))}
              placeholder="Address 2"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              required
              value={contactForm.phones[0] || ''}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phones: [event.target.value, prev.phones[1] || ''] }))}
              placeholder="Phone 1"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={contactForm.phones[1] || ''}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phones: [prev.phones[0] || '', event.target.value] }))}
              placeholder="Phone 2"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              required
              value={contactForm.email}
              onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Contact Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              required
              value={contactForm.officeHours}
              onChange={(event) => setContactForm((prev) => ({ ...prev, officeHours: event.target.value }))}
              placeholder="Office Hours"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="md:col-span-2">
              <button type="submit" disabled={savingContact} className="btn-primary disabled:opacity-70">
                {savingContact ? 'Saving...' : 'Save Contact Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'admins' && isSuperAdmin && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-secondary">Super Admin Controls</h2>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={adminEmailInput}
              onChange={(event) => setAdminEmailInput(event.target.value)}
              placeholder="Add admin email"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => void addAdmin()}
              disabled={adminActionLoading}
              className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
            >
              Add Admin
            </button>
          </div>

          <div className="space-y-2">
            {adminEmails.map((email) => (
              <div key={email} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <span className="text-secondary">{email}</span>
                {email.toLowerCase() === user.email.toLowerCase() ? (
                  <span className="text-xs font-semibold text-green-700">Current User</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => void removeAdmin(email)}
                    disabled={adminActionLoading}
                    className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-70"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
