'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

type Mode = 'signin' | 'signup'

function toFriendlyError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code || '')
    : ''

  if (code === 'auth/email-already-in-use') return 'This email is already in use.'
  if (code === 'auth/invalid-credential') return 'Invalid email or password.'
  if (code === 'auth/invalid-email') return 'Please enter a valid email address.'
  if (code === 'auth/weak-password') return 'Password should be at least 6 characters.'

  return error instanceof Error ? error.message : 'Authentication failed. Please try again.'
}

export default function LoginPage() {
  const router = useRouter()
  const { signInWithEmail, signUpWithEmail } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        await signUpWithEmail(
          form.fullName,
          form.email,
          form.password,
        )
      } else {
        await signInWithEmail(form.email, form.password)
      }

      router.push('/admin')
    } catch (submitError) {
      setError(toFriendlyError(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="section-heading text-center mb-2">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h1>
        <p className="text-center text-gray-600 mb-6">Use your email and password to continue.</p>

        <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`rounded-md py-2 text-sm font-semibold transition-colors ${
              mode === 'signin' ? 'bg-white text-secondary' : 'text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-md py-2 text-sm font-semibold transition-colors ${
              mode === 'signup' ? 'bg-white text-secondary' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </>
          )}

          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Go back to{' '}
          <Link href="/" className="font-semibold text-primary hover:underline">
            Home
          </Link>
        </p>
      </div>
    </section>
  )
}
