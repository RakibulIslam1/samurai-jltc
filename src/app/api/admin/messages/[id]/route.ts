import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { getAdminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

const VALID_STATUSES = ['new', 'read', 'responded'] as const
type MessageStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request.headers.get('Authorization'))
  } catch (err) {
    if (err instanceof Response) return err
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Missing message id' }, { status: 400 })
  }

  const body = await request.json()
  const { status } = body as { status: MessageStatus }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const db = getAdminDb()
  await db.collection('contactMessages').doc(id).update({ status })

  return NextResponse.json({ success: true })
}
