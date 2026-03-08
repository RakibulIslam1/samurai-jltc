import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Samurai JLTC — our mission, vision, experienced instructors, and the values that guide our Japanese language teaching.',
}

const team = [
  {
    name: 'Yuki Tanaka',
    role: 'Head Instructor & Founder',
    bio: 'Native Japanese speaker with 15+ years of teaching experience. Certified JLPT examiner and language pedagogy specialist.',
    initials: 'YT',
  },
  {
    name: 'Kenji Mori',
    role: 'Senior Language Instructor',
    bio: 'Specialist in business Japanese and advanced grammar. Former translator for international corporations in Tokyo.',
    initials: 'KM',
  },
  {
    name: 'Aiko Suzuki',
    role: 'Conversational Japanese Coach',
    bio: 'Expert in conversational fluency and cultural immersion techniques. Passionate about making Japanese approachable for all learners.',
    initials: 'AS',
  },
]

const values = [
  {
    icon: '🎯',
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards in curriculum design and teaching quality.',
  },
  {
    icon: '🤝',
    title: 'Community',
    description: 'We foster a supportive, inclusive environment where every student can thrive.',
  },
  {
    icon: '🌸',
    title: 'Cultural Respect',
    description: 'Language is inseparable from culture. We teach Japanese with deep respect for its heritage.',
  },
  {
    icon: '🚀',
    title: 'Innovation',
    description: 'We continuously evolve our methods, blending proven techniques with modern learning technology.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            About Samurai JLTC
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Founded with a passion for bridging cultures through language, Samurai JLTC has
            been guiding students on their Japanese language journey for over a decade.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20" aria-labelledby="mission-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="mission-heading" className="section-heading">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To empower students of all backgrounds with the Japanese language skills they
                need to unlock new professional opportunities, deepen cultural connections, and
                achieve their personal goals.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that language learning is a transformative experience. At Samurai
                JLTC, we don&apos;t just teach vocabulary and grammar — we open windows to an entire
                world of culture, history, and human connection.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-secondary mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To be the leading Japanese language training center recognized globally for
                exceptional outcomes, cultural authenticity, and student-centered learning.
              </p>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <span className="text-3xl" aria-hidden="true">⛩</span>
                <p className="text-secondary font-medium italic">
                  &ldquo;The journey of a thousand miles begins with a single step — and a single
                  word.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-20" aria-labelledby="team-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="team-heading" className="section-heading">
            Meet Our Instructors
          </h2>
          <p className="section-subheading mx-auto mb-12">
            Our team of dedicated educators brings native fluency, cultural insight, and years
            of classroom experience to every lesson.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <article
                key={member.name}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4" aria-hidden="true">
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20" aria-labelledby="values-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="values-heading" className="section-heading">
            Our Core Values
          </h2>
          <p className="section-subheading mx-auto mb-12">
            Everything we do is guided by a set of principles that put students and culture first.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary transition-colors text-left"
              >
                <div className="text-3xl mb-3" aria-hidden="true">{value.icon}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Learning With Us</h2>
          <p className="text-gray-300 mb-8">
            Discover the course that&apos;s right for you and take the first step toward Japanese
            fluency today.
          </p>
          <Link href="/services" className="btn-primary text-base">
            View Our Courses
          </Link>
        </div>
      </section>
    </>
  )
}
