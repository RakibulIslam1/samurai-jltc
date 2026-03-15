'use client'

import { useEffect, useState } from 'react'
import { loadGalleryItems, type GalleryItem } from '@/lib/gallery'

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const nextItems = await loadGalleryItems()
      setItems(nextItems)
      setLoading(false)
    }

    void load()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="section-heading mb-2">Gallery</h1>
        <p className="text-gray-600">Moments from classes, events, and student journeys.</p>
      </div>

      {loading && <p className="text-center text-gray-600">Loading gallery...</p>}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <p className="text-gray-600">Gallery is empty right now. Admin can upload photos from the admin panel.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.imageDataUrl}
                  alt={item.description || 'Gallery image'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">
                  {item.description || 'Samurai Japanese Language Training Center gallery image.'}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded on {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
