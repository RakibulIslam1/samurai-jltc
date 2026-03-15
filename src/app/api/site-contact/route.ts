import { NextResponse } from 'next/server'

const DEFAULT_SETTINGS = {
  addressPrimary: 'House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212, Bangladesh',
  addressSecondary: 'Tokyo-to Kita-ku Akabane Nishi 4-35-5 Sakauekup 101, Japan',
  phones: ['01601687773', '+81 70-9039-4475'],
  email: 'miahsuzan818@gmail.com',
  officeHours: 'Mon-Fri: 9am-8pm',
}

export async function GET() {
  return NextResponse.json({ settings: DEFAULT_SETTINGS })
}
