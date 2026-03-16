'use client'

import { useEffect, useState } from 'react'
import { loadAchievementItems, type AchievementItem } from '@/lib/achievement'

export default function AchievementPage() {
  const [items, setItems] = useState<AchievementItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const nextItems = await loadAchievementItems()
      setItems(nextItems)
      setLoading(false)
    }

    void load()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="section-heading mb-2">Our Achievements</h1>
        <p className="mx-auto max-w-xl text-gray-600">
          Celebrating the milestones, success stories, and proud moments of Samurai Japanese Language Training Center students and staff.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading achievements...</p>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <div className="mb-3 text-5xl">🏆</div>
          <p className="text-lg font-semibold text-secondary">No achievements yet</p>
          <p className="mt-1 text-sm text-gray-500">Admin can upload achievement photos from the admin panel.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Trophy badge */}
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={item.imageDataUrl}
                  alt={item.description || 'Achievement'}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-yellow-600 shadow-sm backdrop-blur-sm">
                  🏆 Achievement
                </span>
              </div>
              <div className="space-y-2 p-4">
                <p className="text-sm font-medium leading-relaxed text-gray-800">
                  {item.description || 'Samurai JLTC achievement.'}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
