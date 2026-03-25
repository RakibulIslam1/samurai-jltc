'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordReset } from '@/lib/firebase'

function toFriendlyError(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '')
      : ''

  if (code === 'auth/invalid-email') return 'Please enter a valid email address.'
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.'
  if (code === 'auth/network-request-failed') return 'Network issue. Check your connection and try again.'

  return error instanceof Error ? error.message : 'Could not send reset email. Please try again.'
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    setLoading(true)
    try {
      await sendPasswordReset(email.trim())
      setSuccess(true)
    } catch (submitError) {
      setError(toFriendlyError(submitError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="section-heading text-center mb-2">Reset Password</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your account email and we will send a password reset link.
        </p>

        {!success ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
            Reset link sent. Please check your inbox and spam folder.
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Back to{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}