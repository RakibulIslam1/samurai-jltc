import type { Metadata } from 'next'
import Link from 'next/link'
import TeamSection from '@/components/TeamSection'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Samurai Japanese Language Training Center and our education and visa consultancy support for Bangladeshi students.',
}

const values = [
  {
    icon: '🎯',
    title: '3rd Largest Economy',
    description: 'Japan is one of the world\'s leading developed economies and a strong destination for higher education.',
  },
  {
    icon: '🤝',
    title: 'Hi-Tech Country',
    description: 'Japan is known for advanced technology and innovation across education and industry.',
  },
  {
    icon: '🌸',
    title: 'High Part-Time Salary',
    description: 'Students can access comparatively strong part-time earning opportunities.',
  },
  {
    icon: '🚀',
    title: 'Visa-Free Access',
    description: 'Japan offers strong long-term global mobility opportunities for successful students.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            About Our School
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Samurai Japanese Language Training Center is one of the best Japanese language learning centers and student visa consultancy firms in Bangladesh.
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
                We offer comprehensive educational services to Bangladeshi students who intend to study in Japan and other developed countries.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We provide language teaching, student visa processing, and career counseling with practical support at every stage.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-secondary mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To prepare students with language fluency and process support so they can confidently pursue study and career goals abroad.
              </p>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <span className="text-3xl" aria-hidden="true">⛩</span>
                <p className="text-secondary font-medium italic">
                  &ldquo;Your first step to Japan starts with the right language and guidance.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

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
            NAT-TEST Preparation, JLPT Preparation, Student Visa Processing, and Career Counseling in one place.
          </p>
          <Link href="/services" className="btn-primary text-base">
            View Our Courses
          </Link>
        </div>
      </section>
    </>
  )
}
