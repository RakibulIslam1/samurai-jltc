import { collection, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'

export type TeamRole = 'chairman' | 'managing-director' | 'instructor'

export type TeamMember = {
  id: string
  role: TeamRole
  name: string
  imageDataUrl: string
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

export async function loadTeamMembers(): Promise<TeamMember[]> {
  try {
    const db = getFirestoreDb()
    if (!db) return []

    const snap = await getDocs(collection(db, 'teamMembers'))
    const items = snap.docs
      .map((docItem) => {
        const data = docItem.data() as Partial<TeamMember>
        const role = data.role
        if (role !== 'chairman' && role !== 'managing-director' && role !== 'instructor') {
          return null
        }

        return {
          id: docItem.id,
          role,
          name: data.name || '',
          imageDataUrl: data.imageDataUrl || '',
          createdAt: toTimestampValue(data.createdAt),
          updatedAt: toTimestampValue(data.updatedAt),
          uploadedBy: data.uploadedBy,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item && item.name && item.imageDataUrl))

    const roleRank: Record<TeamRole, number> = {
      chairman: 0,
      'managing-director': 1,
      instructor: 2,
    }

    return items.sort((a, b) => {
      const rankDiff = roleRank[a.role] - roleRank[b.role]
      if (rankDiff !== 0) return rankDiff
      if (a.role === 'instructor' && b.role === 'instructor') {
        return b.createdAt - a.createdAt
      }
      return 0
    })
  } catch {
    return []
  }
}
