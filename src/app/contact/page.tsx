'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'
import { useAuth } from '@/components/AuthProvider'
import { defaultSiteContactSettings, loadSiteContactSettings, type SiteContactSettings } from '@/lib/siteContact'

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

export default function ContactPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<SiteContactSettings>(defaultSiteContactSettings)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState('')
  const [threads, setThreads] = useState<ContactThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState('')
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeThreadId) || null, [threads, activeThreadId])

  const loadThreads = async () => {
    if (!user) {
      setThreads([])
      setActiveThreadId('')
      return
    }

    const db = getFirestoreDb()
    if (!db) return

    const q = query(collection(db, 'contactMessages'), where('userId', '==', user.id))
    const snap = await getDocs(q)

    const items = snap.docs
      .map((docItem) => {
        const data = docItem.data() as Partial<ContactThread>
        return {
          id: docItem.id,
          userId: data.userId || user.id,
          name: data.name || user.fullName,
          email: data.email || user.email,
          subject: data.subject || 'No subject',
          status: data.status || 'new',
          updatedAt: toTimestampValue(data.updatedAt),
          createdAt: toTimestampValue(data.createdAt),
          messages: Array.isArray(data.messages) ? data.messages : [],
        }
      })
      .sort((a, b) => b.updatedAt - a.updatedAt)

    setThreads(items)
    if (!activeThreadId && items.length > 0) {
      setActiveThreadId(items[0].id)
    }
  }

  useEffect(() => {
    void loadSiteContactSettings().then(setSettings)
  }, [])

  useEffect(() => {
    if (!user) {
      setForm((prev) => ({ ...prev, name: '', email: '' }))
      return
    }

    setForm((prev) => ({
      ...prev,
      name: prev.name || user.fullName,
      email: prev.email || user.email,
    }))

    void loadThreads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const submitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!user) {
      setError('Please sign in to send and continue chat messages.')
      return
    }

    const messageText = form.message.trim()
    if (messageText.length < 10) {
      setError('Message should be at least 10 characters.')
      return
    }

    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured.')
      return
    }

    setStatus('loading')

    try {
      await addDoc(collection(db, 'contactMessages'), {
        userId: user.id,
        name: form.name.trim() || user.fullName,
        email: form.email.trim() || user.email,
        emailLower: (form.email.trim() || user.email).toLowerCase(),
        subject: form.subject.trim(),
        status: 'new',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [
          {
            sender: 'user',
            text: messageText,
            createdAt: Date.now(),
            senderName: form.name.trim() || user.fullName,
          },
        ],
        serverUpdatedAt: serverTimestamp(),
      })

      setStatus('success')
      setForm((prev) => ({ ...prev, subject: '', message: '' }))
      await loadThreads()
    } catch (submitError) {
      setStatus('error')
      setError(submitError instanceof Error ? submitError.message : 'Failed to send message.')
    }
  }

  const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user || !activeThread || !replyText.trim()) return

    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured.')
      return
    }

    setIsReplying(true)
    try {
      const nextMessages = [
        ...(activeThread.messages || []),
        {
          sender: 'user' as const,
          text: replyText.trim(),
          createdAt: Date.now(),
          senderName: user.fullName,
        },
      ]

      await setDoc(
        doc(db, 'contactMessages', activeThread.id),
        {
          messages: nextMessages,
          updatedAt: Date.now(),
          status: 'open',
          serverUpdatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      setReplyText('')
      await loadThreads()
    } catch (replyError) {
      setError(replyError instanceof Error ? replyError.message : 'Failed to send reply.')
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="section-heading mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">Send us a message and continue the conversation from this page.</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div id="enroll" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
          <h2 className="text-2xl font-bold text-secondary mb-6">Send Message</h2>

          {!user && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Please sign in to start chatting.
            </p>
          )}

          <form className="space-y-4" onSubmit={submitMessage}>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={form.name}
              disabled={!user}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              required
              placeholder="Your Email"
              value={form.email}
              disabled={!user}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              required
              placeholder="Subject"
              value={form.subject}
              onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              required
              rows={5}
              placeholder="Write your message..."
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {status === 'success' && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Message sent successfully.</p>
            )}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-70">
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-secondary mb-4">Contact Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Bangladesh Office:</span> {settings.addressPrimary}</p>
              {settings.addressSecondary && <p><span className="font-semibold">Japan Office:</span> {settings.addressSecondary}</p>}
              <p><span className="font-semibold">Bangladesh Phone:</span> {settings.phones[0] || '-'}</p>
              <p><span className="font-semibold">Japan Phone:</span> {settings.phones[1] || '-'}</p>
              <p><span className="font-semibold">Email:</span> {settings.email}</p>
              <p><span className="font-semibold">Office Hours:</span> {settings.officeHours}</p>
            </div>
          </div>

          {user && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-secondary mb-4">Your Conversations</h2>

              {threads.length === 0 ? (
                <p className="text-sm text-gray-600">No conversations yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="max-h-64 space-y-2 overflow-auto pr-1">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => setActiveThreadId(thread.id)}
                        className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                          activeThreadId === thread.id ? 'border-primary bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <p className="font-semibold text-secondary">{thread.subject || 'No subject'}</p>
                        <p className="text-xs text-gray-500">{new Date(thread.updatedAt).toLocaleString()}</p>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gray-200 p-3">
                    {!activeThread ? (
                      <p className="text-sm text-gray-600">Select a conversation.</p>
                    ) : (
                      <>
                        <div className="max-h-56 space-y-2 overflow-auto pr-1">
                          {(activeThread.messages || []).map((message, index) => (
                            <div
                              key={`${message.createdAt}-${index}`}
                              className={`rounded-lg px-3 py-2 text-sm ${
                                message.sender === 'admin' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-secondary'
                              }`}
                            >
                              <p className="mb-1 text-xs font-semibold">{message.sender === 'admin' ? 'Admin' : 'You'}</p>
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={submitReply} className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                            placeholder="Reply..."
                            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="submit"
                            disabled={isReplying}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
                          >
                            {isReplying ? 'Sending...' : 'Reply'}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
