import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { getAdminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    await requireAdmin(request.headers.get('Authorization'))
  } catch (err) {
    if (err instanceof Response) return err
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminDb()
  const snap = await db
    .collection('contactMessages')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get()

  const messages = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return NextResponse.json({ messages })
}
