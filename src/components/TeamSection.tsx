'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadTeamMembers, type TeamMember } from '@/lib/team'

function roleLabel(role: TeamMember['role']) {
  if (role === 'chairman') return 'Chairman'
  if (role === 'managing-director') return 'Managing Director'
  return 'Language Instructor'
}

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const nextMembers = await loadTeamMembers()
      setMembers(nextMembers)
      setLoading(false)
    }

    void load()
  }, [])

  const chairman = useMemo(() => members.find((member) => member.role === 'chairman') || null, [members])
  const managingDirector = useMemo(() => members.find((member) => member.role === 'managing-director') || null, [members])
  const instructors = useMemo(() => members.filter((member) => member.role === 'instructor'), [members])
  const leadership = useMemo(() => [chairman, managingDirector].filter((member): member is TeamMember => Boolean(member)), [chairman, managingDirector])

  return (
    <section className="bg-gray-50 py-20" aria-labelledby="team-heading">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="team-heading" className="section-heading">
          Our Team
        </h2>
        <p className="section-subheading mx-auto mb-12">
          Leadership and language experts guiding students from classroom to career.
        </p>

        {loading && <p className="text-gray-600">Loading team members...</p>}

        {!loading && !chairman && !managingDirector && instructors.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12">
            <p className="text-gray-600">Team members will appear here after admin uploads them from the admin panel.</p>
          </div>
        )}

        {!loading && leadership.length > 0 && (
          <div className="mb-10 grid grid-cols-1 gap-6 justify-items-center md:grid-cols-2">
            {leadership.map((member) => (
              <article key={member.id} className="w-full max-w-[260px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="aspect-square w-full bg-gray-100 p-2">
                  <img src={member.imageDataUrl} alt={member.name} className="h-full w-full object-contain" />
                </div>
                <div className="p-4 text-center">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{roleLabel(member.role)}</p>
                  <h3 className="text-xl font-bold text-secondary">{member.name}</h3>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && instructors.length > 0 && (
          <>
            <h3 className="mb-4 text-2xl font-bold text-secondary">Language Instructors</h3>
            <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((member) => (
                <article key={member.id} className="w-full max-w-[260px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="aspect-square w-full bg-gray-100 p-2">
                    <img src={member.imageDataUrl} alt={member.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="p-4 text-center">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{roleLabel(member.role)}</p>
                    <h4 className="text-lg font-bold text-secondary">{member.name}</h4>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
