import { collection, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'

export type AchievementItem = {
  id: string
  imageDataUrl: string
  description: string
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

export async function loadAchievementItems(): Promise<AchievementItem[]> {
  try {
    const db = getFirestoreDb()
    if (!db) return []

    const snap = await getDocs(collection(db, 'achievementItems'))
    return snap.docs
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
  } catch {
    return []
  }
}
