'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  addDoc,
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
import type { GalleryItem } from '@/lib/gallery'
import type { AchievementItem } from '@/lib/achievement'
import type { TeamMember, TeamRole } from '@/lib/team'

type AdminTab = 'profiles' | 'messages' | 'contact' | 'gallery' | 'achievement' | 'team' | 'admins'

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

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
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

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryDescription, setGalleryDescription] = useState('')
  const [galleryImageDataUrl, setGalleryImageDataUrl] = useState('')
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [deletingGalleryId, setDeletingGalleryId] = useState('')

  const [achievementItems, setAchievementItems] = useState<AchievementItem[]>([])
  const [achievementLoading, setAchievementLoading] = useState(false)
  const [achievementDescription, setAchievementDescription] = useState('')
  const [achievementImageDataUrl, setAchievementImageDataUrl] = useState('')
  const [uploadingAchievement, setUploadingAchievement] = useState(false)
  const [deletingAchievementId, setDeletingAchievementId] = useState('')

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamRole, setTeamRole] = useState<TeamRole>('instructor')
  const [teamImageDataUrl, setTeamImageDataUrl] = useState('')
  const [teamDescription, setTeamDescription] = useState('') // Only for instructor
  const [savingTeam, setSavingTeam] = useState(false)
  const [deletingTeamId, setDeletingTeamId] = useState('')

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

  const loadGalleryItems = async () => {
    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    setGalleryLoading(true)
    try {
      const snap = await getDocs(collection(db, 'galleryItems'))
      const items = snap.docs
        .map((docItem) => {
          const data = docItem.data() as Partial<GalleryItem>
          return {
            id: docItem.id,
            imageDataUrl: data.imageDataUrl || '',
            description: data.description || '',
            createdAt: toTimestampValue(data.createdAt),
            updatedAt: toTimestampValue(data.updatedAt),
            uploadedBy: data.uploadedBy,
          }
        })
        .filter((item) => item.imageDataUrl)
        .sort((a, b) => b.createdAt - a.createdAt)

      setGalleryItems(items)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load gallery items.')
    } finally {
      setGalleryLoading(false)
    }
  }

  const loadAchievementItems = async () => {
    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    setAchievementLoading(true)
    try {
      const snap = await getDocs(collection(db, 'achievementItems'))
      const items = snap.docs
        .map((docItem) => {
          const data = docItem.data() as Partial<AchievementItem>
          return {
            id: docItem.id,
            imageDataUrl: data.imageDataUrl || '',
            description: data.description || '',
            createdAt: toTimestampValue(data.createdAt),
            updatedAt: toTimestampValue(data.updatedAt),
            uploadedBy: data.uploadedBy,
          }
        })
        .filter((item) => item.imageDataUrl)
        .sort((a, b) => b.createdAt - a.createdAt)

      setAchievementItems(items)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load achievement items.')
    } finally {
      setAchievementLoading(false)
    }
  }

  const loadTeamMembers = async () => {
    const db = getFirestoreDb()
    if (!db) {
      setError('Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    setTeamLoading(true)
    try {
      const snap = await getDocs(collection(db, 'teamMembers'))
      const roleRank: Record<TeamRole, number> = {
        chairman: 0,
        'managing-director': 1,
        instructor: 2,
      }

      const items = snap.docs
        .map((docItem) => {
          const data = docItem.data() as Partial<TeamMember>
          if (data.role !== 'chairman' && data.role !== 'managing-director' && data.role !== 'instructor') {
            return null
          }
          return {
            id: docItem.id,
            role: data.role,
            name: data.name || '',
            imageDataUrl: data.imageDataUrl || '',
            createdAt: toTimestampValue(data.createdAt),
            updatedAt: toTimestampValue(data.updatedAt),
            uploadedBy: data.uploadedBy,
          }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item && item.name && item.imageDataUrl))
        .sort((a, b) => {
          const rankDiff = roleRank[a.role] - roleRank[b.role]
          if (rankDiff !== 0) return rankDiff
          if (a.role === 'instructor' && b.role === 'instructor') {
            return b.createdAt - a.createdAt
          }
          return 0
        })

      setTeamMembers(items)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load team members.')
    } finally {
      setTeamLoading(false)
    }
  }

  useEffect(() => {
    if (loading || !user || !isAdmin) return
    setError('')
    void Promise.all([
      loadProfiles(),
      loadThreads(),
      loadContactSettings(),
      loadGalleryItems(),
      loadAchievementItems(),
      loadTeamMembers(),
    ])
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

  const onGalleryFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for the gallery.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please upload an image under 5 MB.')
      return
    }

    try {
      const dataUrl = await readAsDataUrl(file)
      setGalleryImageDataUrl(dataUrl)
      setError('')
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'Failed to read image file.')
    }
  }

  const uploadGalleryItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!galleryImageDataUrl) {
      setError('Please choose an image before uploading.')
      return
    }

    if (!galleryDescription.trim()) {
      setError('Please add a short description for the gallery image.')
      return
    }

    const db = getFirestoreDb()
    if (!db || !user) return

    setUploadingGallery(true)
    setError('')
    try {
      await addDoc(collection(db, 'galleryItems'), {
        imageDataUrl: galleryImageDataUrl,
        description: galleryDescription.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        uploadedBy: user.email,
        serverUpdatedAt: serverTimestamp(),
      })

      setGalleryDescription('')
      setGalleryImageDataUrl('')
      await loadGalleryItems()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload gallery image.')
    } finally {
      setUploadingGallery(false)
    }
  }

  const deleteGalleryItem = async (id: string) => {
    const db = getFirestoreDb()
    if (!db) return

    setDeletingGalleryId(id)
    setError('')
    try {
      await deleteDoc(doc(db, 'galleryItems', id))
      setGalleryItems((prev) => prev.filter((item) => item.id !== id))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete gallery item.')
    } finally {
      setDeletingGalleryId('')
    }
  }

  const onAchievementFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for achievement.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please upload an image under 5 MB.')
      return
    }

    try {
      const dataUrl = await readAsDataUrl(file)
      setAchievementImageDataUrl(dataUrl)
      setError('')
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'Failed to read image file.')
    }
  }

  const uploadAchievementItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!achievementImageDataUrl) {
      setError('Please choose an image before uploading achievement.')
      return
    }

    if (!achievementDescription.trim()) {
      setError('Please add a short achievement description.')
      return
    }

    const db = getFirestoreDb()
    if (!db || !user) return

    setUploadingAchievement(true)
    setError('')
    try {
      await addDoc(collection(db, 'achievementItems'), {
        imageDataUrl: achievementImageDataUrl,
        description: achievementDescription.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        uploadedBy: user.email,
        serverUpdatedAt: serverTimestamp(),
      })

      setAchievementDescription('')
      setAchievementImageDataUrl('')
      await loadAchievementItems()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload achievement image.')
    } finally {
      setUploadingAchievement(false)
    }
  }

  const deleteAchievementItem = async (id: string) => {
    const db = getFirestoreDb()
    if (!db) return

    setDeletingAchievementId(id)
    setError('')
    try {
      await deleteDoc(doc(db, 'achievementItems', id))
      setAchievementItems((prev) => prev.filter((item) => item.id !== id))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete achievement item.')
    } finally {
      setDeletingAchievementId('')
    }
  }

  const onTeamFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for team member.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please upload an image under 5 MB.')
      return
    }

    try {
      const dataUrl = await readAsDataUrl(file)
      setTeamImageDataUrl(dataUrl)
      setError('')
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'Failed to read image file.')
    }
  }

  const saveTeamMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!teamName.trim()) {
      setError('Team member name is required.')
      return
    }

    if (!teamImageDataUrl) {
      setError('Please choose an image for team member.')
      return
    }

    if (teamRole === 'instructor' && !teamDescription.trim()) {
      setError('Please add a description for instructor.')
      return
    }

    const db = getFirestoreDb()
    if (!db || !user) return

    setSavingTeam(true)
    setError('')
    try {
      const payload = {
        role: teamRole,
        name: teamName.trim(),
        imageDataUrl: teamImageDataUrl,
        updatedAt: Date.now(),
        uploadedBy: user.email,
        serverUpdatedAt: serverTimestamp(),
        description: teamRole === 'instructor' ? teamDescription.trim() : undefined,
      }

      if (teamRole === 'chairman' || teamRole === 'managing-director') {
        await setDoc(
          doc(db, 'teamMembers', teamRole),
          {
            ...payload,
            createdAt: Date.now(),
          },
          { merge: true },
        )
      } else {
        await addDoc(collection(db, 'teamMembers'), {
          ...payload,
          createdAt: Date.now(),
        })
      }

      setTeamName('')
      setTeamRole('instructor')
      setTeamImageDataUrl('')
      setTeamDescription('')
      await loadTeamMembers()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save team member.')
    } finally {
      setSavingTeam(false)
    }
  }

  const deleteTeamMember = async (id: string) => {
    const db = getFirestoreDb()
    if (!db) return

    setDeletingTeamId(id)
    setError('')
    try {
      await deleteDoc(doc(db, 'teamMembers', id))
      setTeamMembers((prev) => prev.filter((item) => item.id !== id))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete team member.')
    } finally {
      setDeletingTeamId('')
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
        <button type="button" onClick={() => setActiveTab('gallery')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'gallery' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
          Gallery
        </button>
        <button type="button" onClick={() => setActiveTab('achievement')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'achievement' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
          Achievement
        </button>
        <button type="button" onClick={() => setActiveTab('team')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'team' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
          Team
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
              placeholder="Bangladesh Office Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={contactForm.addressSecondary}
              onChange={(event) => setContactForm((prev) => ({ ...prev, addressSecondary: event.target.value }))}
              placeholder="Japan Office Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              required
              value={contactForm.phones[0] || ''}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phones: [event.target.value, prev.phones[1] || ''] }))}
              placeholder="Bangladesh Office Phone"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={contactForm.phones[1] || ''}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phones: [prev.phones[0] || '', event.target.value] }))}
              placeholder="Japan Office Phone"
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

      {activeTab === 'gallery' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-secondary">Upload Gallery Image</h2>
            <form onSubmit={uploadGalleryItem} className="space-y-4">
              <input type="file" accept="image/*" onChange={onGalleryFileChange} />
              <textarea
                rows={2}
                required
                value={galleryDescription}
                onChange={(event) => setGalleryDescription(event.target.value)}
                placeholder="Write one-line image description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {galleryImageDataUrl && (
                <img
                  src={galleryImageDataUrl}
                  alt="Gallery preview"
                  className="h-40 w-full max-w-sm rounded-xl border border-gray-200 object-cover"
                />
              )}
              <button type="submit" disabled={uploadingGallery} className="btn-primary disabled:opacity-70">
                {uploadingGallery ? 'Uploading...' : 'Upload to Gallery'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-secondary">Gallery Items</h2>
            {galleryLoading && <p className="text-sm text-gray-600">Loading gallery items...</p>}
            {!galleryLoading && galleryItems.length === 0 && (
              <p className="text-sm text-gray-600">No gallery images uploaded yet.</p>
            )}

            {!galleryLoading && galleryItems.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {galleryItems.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img src={item.imageDataUrl} alt={item.description || 'Gallery image'} className="h-48 w-full object-cover" />
                    <div className="space-y-3 p-3">
                      <p className="text-sm text-gray-700">{item.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-70"
                          disabled={deletingGalleryId === item.id}
                          onClick={() => {
                            if (window.confirm('Delete this gallery image?')) {
                              void deleteGalleryItem(item.id)
                            }
                          }}
                        >
                          {deletingGalleryId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'achievement' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-secondary">Upload Achievement Image</h2>
            <form onSubmit={uploadAchievementItem} className="space-y-4">
              <input type="file" accept="image/*" onChange={onAchievementFileChange} />
              <textarea
                rows={2}
                required
                value={achievementDescription}
                onChange={(event) => setAchievementDescription(event.target.value)}
                placeholder="Write one-line achievement description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {achievementImageDataUrl && (
                <img
                  src={achievementImageDataUrl}
                  alt="Achievement preview"
                  className="h-40 w-full max-w-sm rounded-xl border border-gray-200 object-cover"
                />
              )}
              <button type="submit" disabled={uploadingAchievement} className="btn-primary disabled:opacity-70">
                {uploadingAchievement ? 'Uploading...' : 'Upload Achievement'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-secondary">Achievement Items</h2>
            {achievementLoading && <p className="text-sm text-gray-600">Loading achievement items...</p>}
            {!achievementLoading && achievementItems.length === 0 && (
              <p className="text-sm text-gray-600">No achievement images uploaded yet.</p>
            )}

            {!achievementLoading && achievementItems.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {achievementItems.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img src={item.imageDataUrl} alt={item.description || 'Achievement image'} className="h-48 w-full object-cover" />
                    <div className="space-y-3 p-3">
                      <p className="text-sm text-gray-700">{item.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-70"
                          disabled={deletingAchievementId === item.id}
                          onClick={() => {
                            if (window.confirm('Delete this achievement image?')) {
                              void deleteAchievementItem(item.id)
                            }
                          }}
                        >
                          {deletingAchievementId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-secondary">Upload Team Member</h2>
            <p className="mb-4 text-sm text-gray-600">
              Chairman and Managing Director are single posts. Uploading again will replace the previous profile.
            </p>
            <form onSubmit={saveTeamMember} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="Team member name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={teamRole}
                  onChange={(event) => setTeamRole(event.target.value as TeamRole)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="chairman">Chairman</option>
                  <option value="managing-director">Managing Director</option>
                  <option value="instructor">Language Instructor</option>
                </select>
              </div>

              {teamRole === 'instructor' && (
                <textarea
                  rows={2}
                  required
                  value={teamDescription}
                  onChange={(event) => setTeamDescription(event.target.value)}
                  placeholder="Instructor description"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}

              <input type="file" accept="image/*" onChange={onTeamFileChange} />

              {teamImageDataUrl && (
                <img
                  src={teamImageDataUrl}
                  alt="Team member preview"
                  className="h-40 w-full max-w-sm rounded-xl border border-gray-200 object-cover"
                />
              )}

              <button type="submit" disabled={savingTeam} className="btn-primary disabled:opacity-70">
                {savingTeam ? 'Saving...' : 'Save Team Member'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-secondary">Current Team Members</h2>
            {teamLoading && <p className="text-sm text-gray-600">Loading team members...</p>}
            {!teamLoading && teamMembers.length === 0 && (
              <p className="text-sm text-gray-600">No team members uploaded yet.</p>
            )}

            {!teamLoading && teamMembers.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {teamMembers.map((member) => (
                  <article key={member.id} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img src={member.imageDataUrl} alt={member.name} className="h-48 w-full object-cover" />
                    <div className="space-y-3 p-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {member.role === 'chairman'
                            ? 'Chairman'
                            : member.role === 'managing-director'
                              ? 'Managing Director'
                              : 'Language Instructor'}
                        </p>
                        <p className="text-sm font-semibold text-secondary">{member.name}</p>
                        {member.role === 'instructor' && member.description && (
                          <p className="mt-2 text-xs text-gray-700">{member.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500">{new Date(member.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-70"
                          disabled={deletingTeamId === member.id}
                          onClick={() => {
                            if (window.confirm('Delete this team member?')) {
                              void deleteTeamMember(member.id)
                            }
                          }}
                        >
                          {deletingTeamId === member.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
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
