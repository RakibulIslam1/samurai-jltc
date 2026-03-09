'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { getClientAuth } from '@/lib/firebase-client'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'responded'
  createdAt: string
}

interface AdminRoles {
  superAdmins: string[]
  admins: string[]
}

const STATUS_LABELS: Record<ContactMessage['status'], string> = {
  new: 'New',
  read: 'Read',
  responded: 'Responded',
}

const STATUS_COLORS: Record<ContactMessage['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-gray-100 text-gray-700',
  responded: 'bg-green-100 text-green-800',
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [roles, setRoles] = useState<AdminRoles | null>(null)
  const [activeTab, setActiveTab] = useState<'messages' | 'roles'>('messages')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Admin management state
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'superAdmin'>('admin')
  const [rolesError, setRolesError] = useState('')
  const [rolesSuccess, setRolesSuccess] = useState('')

  const getIdToken = useCallback(async (currentUser: User) => {
    return await currentUser.getIdToken()
  }, [])

  const fetchMessages = useCallback(async (currentUser: User) => {
    try {
      const token = await getIdToken(currentUser)
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages)
      }
    } catch {
      // ignore
    }
  }, [getIdToken])

  const fetchRoles = useCallback(async (currentUser: User) => {
    try {
      const token = await getIdToken(currentUser)
      const res = await fetch('/api/admin/roles', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setRoles(data.roles)
        const email = currentUser.email?.toLowerCase() ?? ''
        setIsSuperAdmin(data.roles.superAdmins?.includes(email) ?? false)
      }
    } catch {
      // ignore
    }
  }, [getIdToken])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getClientAuth(), async (currentUser) => {
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
      await Promise.all([fetchMessages(currentUser), fetchRoles(currentUser)])
      setLoading(false)
    })
    return unsubscribe
  }, [router, fetchMessages, fetchRoles])

  async function updateMessageStatus(id: string, status: ContactMessage['status']) {
    if (!user) return
    setActionLoading(id)
    try {
      const token = await getIdToken(user)
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRoleAction(action: 'add' | 'remove', email: string, role: 'admin' | 'superAdmin') {
    if (!user) return
    setRolesError('')
    setRolesSuccess('')
    try {
      const token = await getIdToken(user)
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRolesError(data.error)
      } else {
        setRolesSuccess(`Successfully ${action === 'add' ? 'added' : 'removed'} ${email}.`)
        setNewAdminEmail('')
        await fetchRoles(user)
      }
    } catch {
      setRolesError('An unexpected error occurred.')
    }
  }

  async function handleSignOut() {
    await signOut(getClientAuth())
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2" aria-hidden="true">⛩</p>
          <p className="text-gray-500">Loading admin panel…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-secondary text-white px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden="true">⛩</span>
          <span className="font-bold">Samurai JLTC Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300">{user?.email}</span>
          {isSuperAdmin && (
            <span className="bg-gold text-secondary font-bold text-xs px-2 py-1 rounded-full">
              Super Admin
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-secondary'
            }`}
          >
            Contact Messages ({messages.length})
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('roles')}
              className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-secondary'
              }`}
            >
              Manage Admins
            </button>
          )}
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <h1 className="text-2xl font-bold text-secondary mb-6">Contact Messages</h1>
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center text-gray-500">
                No messages yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <article
                    key={msg.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="font-bold text-secondary">{msg.name}</h2>
                        <p className="text-gray-500 text-sm">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
                        <p className="text-primary font-medium text-sm mt-1">{msg.subject}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[msg.status]}`}>
                          {STATUS_LABELS[msg.status]}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{msg.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      {(['new', 'read', 'responded'] as const).map((s) => (
                        <button
                          key={s}
                          disabled={msg.status === s || actionLoading === msg.id}
                          onClick={() => updateMessageStatus(msg.id, s)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            msg.status === s
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                          }`}
                        >
                          Mark as {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Roles Tab (super admin only) */}
        {activeTab === 'roles' && isSuperAdmin && roles && (
          <div>
            <h1 className="text-2xl font-bold text-secondary mb-6">Manage Admins</h1>

            {rolesError && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-4">
                {rolesError}
              </div>
            )}
            {rolesSuccess && (
              <div role="status" className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm mb-4">
                {rolesSuccess}
              </div>
            )}

            {/* Add Admin Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <h2 className="font-bold text-secondary mb-4">Add Admin</h2>
              <div className="flex flex-wrap gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border border-gray-300 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                />
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'superAdmin')}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
                <button
                  onClick={() => handleRoleAction('add', newAdminEmail, newAdminRole)}
                  disabled={!newAdminEmail.trim()}
                  className="btn-primary text-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Super Admins */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
              <h2 className="font-bold text-secondary mb-4">
                Super Admins ({roles.superAdmins.length})
              </h2>
              {roles.superAdmins.length === 0 ? (
                <p className="text-gray-400 text-sm">No super admins found.</p>
              ) : (
                <ul className="space-y-2">
                  {roles.superAdmins.map((email) => (
                    <li key={email} className="flex items-center justify-between gap-4">
                      <span className="text-secondary text-sm">{email}</span>
                      <button
                        onClick={() => handleRoleAction('remove', email, 'superAdmin')}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold disabled:opacity-40"
                        disabled={roles.superAdmins.length <= 1}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Admins */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="font-bold text-secondary mb-4">
                Admins ({roles.admins.length})
              </h2>
              {roles.admins.length === 0 ? (
                <p className="text-gray-400 text-sm">No regular admins found.</p>
              ) : (
                <ul className="space-y-2">
                  {roles.admins.map((email) => (
                    <li key={email} className="flex items-center justify-between gap-4">
                      <span className="text-secondary text-sm">{email}</span>
                      <button
                        onClick={() => handleRoleAction('remove', email, 'admin')}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
