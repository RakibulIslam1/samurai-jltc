import { collection, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'

export type CourseBanner = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  icon: string
  bgColor: string
  highlighted: boolean
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

// Default banners (fallback if Firestore unavailable)
const DEFAULT_BANNERS: Omit<CourseBanner, 'id'>[] = [
  {
    name: 'Beginner Level',
    price: 'N5: 99,000 BDT',
    description: 'For complete beginners (N5-N4)',
    features: [
      'Basic Japanese and daily conversation',
      'Grammar, vocabulary, reading, writing',
      'Kanji writing and listening',
      'N4: 120,000 BDT',
    ],
    cta: 'Enroll Now',
    icon: '🌱',
    bgColor: 'bg-white',
    highlighted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Intermediate Level',
    price: 'N3: 150,000 BDT',
    description: 'Daily conversation possible',
    features: [
      'Complex grammar and expressions',
      'Reading articles and practical content',
      'Basic business Japanese situations',
      'Communication-focused practice',
    ],
    cta: 'Enroll Now',
    icon: '⭐',
    bgColor: 'bg-secondary',
    highlighted: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Advanced Level',
    price: 'N2: 180,000 BDT',
    description: 'Fluent speaking level (N2-N1)',
    features: [
      'Specialized topic discussion',
      'University-level reading and writing',
      'Business Japanese and job preparation',
      'N1: 200,000 BDT',
    ],
    cta: 'Enroll Now',
    icon: '🎌',
    bgColor: 'bg-white',
    highlighted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

export async function loadCourseBanners(): Promise<CourseBanner[]> {
  try {
    const db = getFirestoreDb()
    if (!db) return DEFAULT_BANNERS.map((b, i) => ({ id: `tier${i + 1}`, ...b }))

    const snap = await getDocs(collection(db, 'courseBanners'))

    if (snap.empty) {
      return DEFAULT_BANNERS.map((b, i) => ({ id: `tier${i + 1}`, ...b }))
    }

    return snap.docs
      .map((docItem) => {
        const data = docItem.data() as Partial<CourseBanner>
        return {
          id: docItem.id,
          name: data.name || '',
          price: data.price || '',
          description: data.description || '',
          features: Array.isArray(data.features) ? data.features : [],
          cta: data.cta || 'Enroll Now',
          icon: data.icon || '📚',
          bgColor: data.bgColor || 'bg-white',
          highlighted: Boolean(data.highlighted),
          createdAt: toTimestampValue(data.createdAt),
          updatedAt: toTimestampValue(data.updatedAt),
          uploadedBy: data.uploadedBy,
        }
      })
      .sort((a, b) => a.id.localeCompare(b.id))
  } catch {
    return DEFAULT_BANNERS.map((b, i) => ({ id: `tier${i + 1}`, ...b }))
  }
}
