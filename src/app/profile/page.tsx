'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

type ImageSource = {
  raw: string
  zoom: number
  panX: number
  panY: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}

async function createCroppedDataUrl(source: ImageSource) {
  const previewSize = 224
  const outputSize = 700
  const img = new window.Image()

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image for framing.'))
    img.src = source.raw
  })

  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas is not available.')
  }

  const baseScale = Math.max(outputSize / img.width, outputSize / img.height)
  const drawWidth = img.width * baseScale * source.zoom
  const drawHeight = img.height * baseScale * source.zoom
  const ratio = outputSize / previewSize

  const preferredX = (outputSize - drawWidth) / 2 + source.panX * ratio
  const preferredY = (outputSize - drawHeight) / 2 + source.panY * ratio

  const minX = outputSize - drawWidth
  const minY = outputSize - drawHeight
  const drawX = clamp(preferredX, minX, 0)
  const drawY = clamp(preferredY, minY, 0)

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
  return canvas.toDataURL('image/jpeg', 0.82)
}

export default function ProfilePage() {
  const { user, profile, loading, updateUserProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageSource, setImageSource] = useState<ImageSource | null>(null)
  const dragRef = useRef({ active: false, pointerId: -1, startX: 0, startY: 0, basePanX: 0, basePanY: 0 })

  const [form, setForm] = useState({
    fullName: profile?.fullName || user?.fullName || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    educationLevel: profile?.educationLevel || '',
    instituteName: profile?.instituteName || '',
    addressPrimary: profile?.addressPrimary || '',
    addressSecondary: profile?.addressSecondary || '',
    profilePhotoDataUrl: profile?.profilePhotoDataUrl || '',
  })

  useMemo(() => {
    setForm({
      fullName: profile?.fullName || user?.fullName || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      educationLevel: profile?.educationLevel || '',
      instituteName: profile?.instituteName || '',
      addressPrimary: profile?.addressPrimary || '',
      addressSecondary: profile?.addressSecondary || '',
      profilePhotoDataUrl: profile?.profilePhotoDataUrl || '',
    })
  }, [profile, user])

  if (loading) {
    return <section className="px-4 py-20 text-center text-gray-600">Loading profile...</section>
  }

  if (!user) {
    return (
      <section className="px-4 py-20 text-center">
        <h1 className="section-heading">Sign In Required</h1>
        <p className="text-gray-600 mb-6">Please sign in to access profile settings.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </section>
    )
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please use an image under 10 MB.')
      return
    }

    const raw = await readAsDataUrl(file)
    setImageSource({ raw, zoom: 1, panX: 0, panY: 0 })
    setSuccess('Image selected. Reframe and save when ready.')
    setError('')
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let profilePhotoDataUrl = form.profilePhotoDataUrl
      if (imageSource) {
        profilePhotoDataUrl = await createCroppedDataUrl(imageSource)
      }

      await updateUserProfile({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        educationLevel: form.educationLevel,
        instituteName: form.instituteName,
        addressPrimary: form.addressPrimary,
        addressSecondary: form.addressSecondary,
        profilePhotoDataUrl,
      })

      setForm((prev) => ({ ...prev, profilePhotoDataUrl }))
      setImageSource(null)
      setSuccess('Profile updated successfully.')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="section-heading mb-2">My Profile</h1>
      <p className="text-gray-600 mb-8">Profile photo is optional. You can update details anytime.</p>

      <form onSubmit={submit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            required
            type="text"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            placeholder="Full Name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Phone"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            type="text"
            value={form.educationLevel}
            onChange={(event) => setForm((prev) => ({ ...prev, educationLevel: event.target.value }))}
            placeholder="Education Level"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            type="text"
            value={form.instituteName}
            onChange={(event) => setForm((prev) => ({ ...prev, instituteName: event.target.value }))}
            placeholder="Institute Name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={form.addressPrimary}
            onChange={(event) => setForm((prev) => ({ ...prev, addressPrimary: event.target.value }))}
            placeholder="Primary Address"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <input
          type="text"
          value={form.addressSecondary}
          onChange={(event) => setForm((prev) => ({ ...prev, addressSecondary: event.target.value }))}
          placeholder="Secondary Address (optional)"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="space-y-4 rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-secondary">Profile Photo (optional)</p>
          <input type="file" accept="image/*" onChange={onFileChange} />

          {imageSource && (
            <div className="space-y-3">
              <div
                className="relative h-56 w-56 overflow-hidden rounded-full border border-gray-300"
                onWheel={(event) => {
                  event.preventDefault()
                  setImageSource((prev) => {
                    if (!prev) return prev
                    return { ...prev, zoom: clamp(prev.zoom + event.deltaY * -0.004, 1, 2.6) }
                  })
                }}
                onPointerDown={(event) => {
                  if (event.button !== 0) return
                  const current = imageSource
                  dragRef.current = {
                    active: true,
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY,
                    basePanX: current.panX,
                    basePanY: current.panY,
                  }
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onPointerMove={(event) => {
                  const drag = dragRef.current
                  if (!drag.active || drag.pointerId !== event.pointerId) return

                  const deltaX = event.clientX - drag.startX
                  const deltaY = event.clientY - drag.startY
                  setImageSource((prev) => {
                    if (!prev) return prev
                    return {
                      ...prev,
                      panX: clamp(drag.basePanX + deltaX, -140, 140),
                      panY: clamp(drag.basePanY + deltaY, -140, 140),
                    }
                  })
                }}
                onPointerUp={(event) => {
                  if (dragRef.current.pointerId === event.pointerId) {
                    dragRef.current.active = false
                    event.currentTarget.releasePointerCapture(event.pointerId)
                  }
                }}
              >
                <img
                  src={imageSource.raw}
                  alt="Preview"
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${imageSource.panX}px, ${imageSource.panY}px) scale(${imageSource.zoom})`,
                  }}
                />
              </div>

              <input
                type="range"
                min={1}
                max={2.6}
                step={0.01}
                value={imageSource.zoom}
                onChange={(event) =>
                  setImageSource((prev) => (prev ? { ...prev, zoom: Number(event.target.value) } : prev))
                }
              />
            </div>
          )}

          {!imageSource && form.profilePhotoDataUrl && (
            <img src={form.profilePhotoDataUrl} alt="Profile" className="h-24 w-24 rounded-full border border-gray-300 object-cover" />
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  )
}
