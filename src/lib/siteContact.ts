import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'

export type SiteContactSettings = {
  addressPrimary: string
  addressSecondary: string
  phones: string[]
  email: string
  officeHours: string
}

export const defaultSiteContactSettings: SiteContactSettings = {
  addressPrimary: 'House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212, Bangladesh',
  addressSecondary: 'Tokyo-to Kita-ku Akabane Nishi 4-35-5 Sakauekup 101, Japan',
  phones: ['01601687773', '+81 70-9039-4475'],
  email: 'miahsuzan818@gmail.com',
  officeHours: 'Mon-Fri: 9am-8pm',
}

export async function loadSiteContactSettings(): Promise<SiteContactSettings> {
  const fallback = defaultSiteContactSettings

  try {
    const db = getFirestoreDb()
    if (!db) return fallback

    const settingsSnap = await getDoc(doc(db, 'siteSettings', 'contact'))
    if (!settingsSnap.exists()) return fallback

    const data = settingsSnap.data() as Partial<SiteContactSettings> & { phones?: string[] }
    const phones = Array.isArray(data.phones) ? data.phones.filter(Boolean) : fallback.phones

    return {
      addressPrimary: data.addressPrimary || fallback.addressPrimary,
      addressSecondary: data.addressSecondary || '',
      phones: phones.length > 0 ? phones : fallback.phones,
      email: data.email || fallback.email,
      officeHours: data.officeHours || fallback.officeHours,
    }
  } catch {
    return fallback
  }
}
