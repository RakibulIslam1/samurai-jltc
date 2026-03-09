import { NextResponse } from 'next/server'
import { requireSuperAdmin, getAdminRoles } from '@/lib/auth-helpers'
import { getAdminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    await requireSuperAdmin(request.headers.get('Authorization'))
  } catch (err) {
    if (err instanceof Response) return err
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const roles = await getAdminRoles()
  return NextResponse.json({ roles })
}

export async function POST(request: Request) {
  try {
    await requireSuperAdmin(request.headers.get('Authorization'))
  } catch (err) {
    if (err instanceof Response) return err
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, email, role } = body as {
    action: 'add' | 'remove'
    email: string
    role: 'admin' | 'superAdmin'
  }

  if (!action || !email || !role) {
    return NextResponse.json({ error: 'Missing required fields: action, email, role' }, { status: 400 })
  }

  if (!['add', 'remove'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action. Must be "add" or "remove".' }, { status: 400 })
  }

  if (!['admin', 'superAdmin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role. Must be "admin" or "superAdmin".' }, { status: 400 })
  }

  const lc = email.toLowerCase().trim()
  const db = getAdminDb()
  const rolesSnap = await db.collection('adminSettings').doc('roles').get()
  const current = rolesSnap.exists ? (rolesSnap.data() as { superAdmins: string[]; admins: string[] }) : { superAdmins: [], admins: [] }

  const field = role === 'superAdmin' ? 'superAdmins' : 'admins'
  let updated = [...(current[field] ?? [])]

  if (action === 'add') {
    if (!updated.includes(lc)) updated.push(lc)
  } else {
    // Cannot remove last super admin
    if (role === 'superAdmin' && current.superAdmins.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last super admin.' },
        { status: 400 }
      )
    }
    updated = updated.filter((e) => e !== lc)
  }

  await db.collection('adminSettings').doc('roles').set(
    { [field]: updated },
    { merge: true }
  )

  return NextResponse.json({ success: true })
}
