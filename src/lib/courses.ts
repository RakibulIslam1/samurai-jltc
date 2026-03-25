import { collection, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'

export type Course = {
  id: string
  icon: string
  level: string
  title: string
  description: string
  badge: string
  badgeColor: string
  createdAt: number
  updatedAt: number
  uploadedBy?: string
}

function toTimestampValue(value: unknown) {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'toMillis' in value) {
    const fn = value.toMillis
    if (typeof fn === 'function') return fn.call(value)
  }
  return Date.now()
}

export async function loadCourses(): Promise<Course[]> {
  try {
    const db = getFirestoreDb()
    if (!db) return []

    const snap = await getDocs(collection(db, 'courses'))
    return snap.docs
      .map((docItem) => {
        const data = docItem.data() as Partial<Course>
        return {
          id: docItem.id,
          icon: data.icon || '🌱',
          level: data.level || '',
          title: data.title || '',
          description: data.description || '',
          badge: data.badge || '',
          badgeColor: data.badgeColor || 'bg-gray-100 text-gray-800',
          createdAt: toTimestampValue(data.createdAt),
          updatedAt: toTimestampValue(data.updatedAt),
          uploadedBy: data.uploadedBy,
        }
      })
      .filter((item) => item.title)
      .sort((a, b) => a.createdAt - b.createdAt)
  } catch {
    return []
  }
}
