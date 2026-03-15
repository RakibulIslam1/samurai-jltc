import { NextResponse } from 'next/server'

const DEFAULT_SETTINGS = {
  addressPrimary: 'Address not updated yet',
  addressSecondary: '',
  phones: ['01754496926', '01750964611'],
  email: 'info@samurai-jltc.com',
  officeHours: 'Mon-Fri: 9am-8pm',
}

export async function GET() {
  return NextResponse.json({ settings: DEFAULT_SETTINGS })
}
