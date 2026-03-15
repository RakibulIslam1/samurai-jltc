import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services & Courses',
  description:
    'Explore Samurai Japanese Language Training Center services including language training, visa support, design, and IT solutions.',
}

const courses = [
  {
    icon: '🌱',
    level: 'N5-N4 & JFT',
    title: 'Japanese Language Training',
    description:
      'Language courses for complete beginners and progressing learners with conversation, vocabulary, grammar, reading, writing, and culture.',
    badge: 'Beginner',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    icon: '📗',
    level: 'A to Z',
    title: 'Student Visa Support',
    description:
      'Complete support for student visa applications with document preparation and process guidance.',
    badge: 'Intermediate',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    icon: '🏆',
    level: 'TITP / SSW / EHS',
    title: 'Working Visa Support',
    description:
      'Support for TITP, SSW and Engineer/Humanities/International Service visa categories.',
    badge: 'Advanced',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    icon: '📝',
    level: 'Business & Investment',
    title: 'Business Visa',
    description:
      'Setup company and invest in Japan with a complete business visa consultancy process.',
    badge: 'Exam Prep',
    badgeColor: 'bg-red-100 text-red-800',
  },
  {
    icon: '💼',
    level: 'Architecture & Interior',
    title: 'Design Solutions',
    description:
      'Design solutions for architecture and interior projects through consultancy partnerships.',
    badge: 'Professional',
    badgeColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    icon: '💬',
    level: 'Security / Web / Software / Hardware',
    title: 'IT Solutions',
    description:
      'IT solutions including system security, web development, software, and hardware support.',
    badge: 'Speaking',
    badgeColor: 'bg-orange-100 text-orange-800',
  },
]

const pricingTiers = [
  {
    name: 'Beginner Level',
    price: 'N5: 99,000 BDT',
    period: '',
    description: 'For complete beginners (N5-N4)',
    features: [
      'Basic Japanese and daily conversation',
      'Grammar, vocabulary, reading, writing',
      'Kanji writing and listening',
      'N4: 120,000 BDT',
    ],
    cta: 'Enroll Now',
    highlighted: false,
  },
  {
    name: 'Intermediate Level',
    price: 'N3: 150,000 BDT',
    period: '',
    description: 'Daily conversation possible',
    features: [
      'Complex grammar and expressions',
      'Reading articles and practical content',
      'Basic business Japanese situations',
      'Communication-focused practice',
    ],
    cta: 'Enroll Now',
    highlighted: true,
  },
  {
    name: 'Advanced Level',
    price: 'N2: 180,000 BDT',
    period: '',
    description: 'Fluent speaking level (N2-N1)',
    features: [
      'Specialized topic discussion',
      'University-level reading and writing',
      'Business Japanese and job preparation',
      'N1: 200,000 BDT',
    ],
    cta: 'Enroll Now',
    highlighted: false,
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Our Services
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            Language Course & Visa Consultancy
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Japanese Language Training, Student Visa A to Z support, working visa pathways, business visa support, and professional design and IT services.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="bg-white py-20" aria-labelledby="courses-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="courses-heading" className="section-heading text-center">
            Available Courses
          </h2>
          <p className="section-subheading text-center mx-auto mb-12">
            Every course is designed around proven language acquisition methods and delivered
            by certified Japanese language instructors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <article
                key={course.title}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl" aria-hidden="true">{course.icon}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                </div>
                <p className="text-primary font-semibold text-sm mb-1">JLPT {course.level}</p>
                <h3 className="text-xl font-bold text-secondary mb-3">{course.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                  {course.description}
                </p>
                <Link
                  href="/contact"
                  className="btn-primary text-sm py-2 text-center"
                >
                  Enroll Now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="pricing-heading" className="section-heading">
            Course Levels & Fees
          </h2>
          <p className="section-subheading mx-auto mb-12">
            Course fees for beginner, intermediate, and advanced Japanese language tracks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 border flex flex-col ${
                  tier.highlighted
                    ? 'bg-secondary text-white border-secondary shadow-xl scale-105'
                    : 'bg-white border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">
                    Most Popular
                  </p>
                )}
                <h3 className={`text-2xl font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-secondary'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-4 ${tier.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                  {tier.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${tier.highlighted ? 'text-white' : 'text-primary'}`}>
                    {tier.price}
                  </span>
                  <span className={`text-sm ${tier.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                    {tier.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-left">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-green-400 font-bold mt-0.5" aria-hidden="true">✓</span>
                      <span className={`text-sm ${tier.highlighted ? 'text-gray-200' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`text-center font-semibold px-6 py-3 rounded-lg transition-colors duration-200 ${
                    tier.highlighted
                      ? 'bg-primary text-white hover:bg-red-700'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            Educational Qualification Requirements: HSC/Alim/Diploma and equivalent, Honours/Masters degree, and maximum 5 years gap in studies.{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{' '}
            for details and admission support.
          </p>
        </div>
      </section>
    </>
  )
}
