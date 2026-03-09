import { getAdminAuth, getAdminDb } from './firebase-admin'

export interface AdminRoles {
  superAdmins: string[]
  admins: string[]
}

/**
 * Verify Firebase ID token from Authorization header.
 * Returns the decoded token or null on failure.
 */
export async function verifyIdToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  try {
    return await getAdminAuth().verifyIdToken(token)
  } catch {
    return null
  }
}

/**
 * Load the adminSettings/roles document from Firestore.
 */
export async function getAdminRoles(): Promise<AdminRoles> {
  const db = getAdminDb()
  const snap = await db.collection('adminSettings').doc('roles').get()
  if (!snap.exists) {
    return { superAdmins: [], admins: [] }
  }
  const data = snap.data() as Partial<AdminRoles>
  return {
    superAdmins: data.superAdmins ?? [],
    admins: data.admins ?? [],
  }
}

/**
 * Check whether an email is a super admin.
 */
export async function isSuperAdmin(email: string): Promise<boolean> {
  const roles = await getAdminRoles()
  return roles.superAdmins.includes(email.toLowerCase())
}

/**
 * Check whether an email is any kind of admin (super admin or regular admin).
 */
export async function isAdmin(email: string): Promise<boolean> {
  const roles = await getAdminRoles()
  const lc = email.toLowerCase()
  return roles.superAdmins.includes(lc) || roles.admins.includes(lc)
}

/**
 * Require admin access from an Authorization header.
 * Returns { email, uid } on success, throws Response with 401/403 on failure.
 */
export async function requireAdmin(authHeader: string | null): Promise<{ email: string; uid: string }> {
  const decoded = await verifyIdToken(authHeader)
  if (!decoded) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const email = decoded.email ?? ''
  const allowed = await isAdmin(email)
  if (!allowed) {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }
  return { email, uid: decoded.uid }
}

/**
 * Require super admin access from an Authorization header.
 */
export async function requireSuperAdmin(authHeader: string | null): Promise<{ email: string; uid: string }> {
  const decoded = await verifyIdToken(authHeader)
  if (!decoded) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const email = decoded.email ?? ''
  const allowed = await isSuperAdmin(email)
  if (!allowed) {
    throw new Response(JSON.stringify({ error: 'Forbidden: Super admin only' }), { status: 403 })
  }
  return { email, uid: decoded.uid }
}
