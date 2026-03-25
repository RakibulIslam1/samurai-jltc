import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'

const DEFAULT_SETTINGS = {
  addressPrimary: 'House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212, Bangladesh',
  addressSecondary: 'Tokyo-to Kita-ku Akabane Nishi 4-35-5 Sakauekup 101, Japan',
  phones: ['01601687773', '+81 70-9039-4475'],
  email: 'miahsuzan818@gmail.com',
  officeHours: 'Mon-Fri: 9am-8pm',
}

export async function GET() {
  try {
    const db = getFirestoreDb()
    if (!db) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }

    const settingsSnap = await getDoc(doc(db, 'siteSettings', 'contact'))
    if (!settingsSnap.exists()) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }

    const data = settingsSnap.data() as Partial<typeof DEFAULT_SETTINGS> | undefined
    if (!data) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }

    const phones = Array.isArray(data.phones) ? data.phones.filter(Boolean) : DEFAULT_SETTINGS.phones

    const settings = {
      addressPrimary: data.addressPrimary || DEFAULT_SETTINGS.addressPrimary,
      addressSecondary: data.addressSecondary || DEFAULT_SETTINGS.addressSecondary,
      phones: phones.length > 0 ? phones : DEFAULT_SETTINGS.phones,
      email: data.email || DEFAULT_SETTINGS.email,
      officeHours: data.officeHours || DEFAULT_SETTINGS.officeHours,
    }

    return NextResponse.json({ settings })
  } catch {
    return NextResponse.json({ settings: DEFAULT_SETTINGS })
  }
}
