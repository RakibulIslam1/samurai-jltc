import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, subject, message, phone } = body

    // Server-side validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Store in Firestore if admin SDK is configured
    try {
      const { getAdminDb } = await import('@/lib/firebase-admin')
      const db = getAdminDb()
      await db.collection('contactMessages').add({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() ?? '',
        subject,
        message: message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      })
    } catch (dbErr) {
      // Log but don't fail — the contact form should still respond successfully
      console.error('Failed to save contact message to Firestore:', dbErr)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you within 24 hours.',
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
