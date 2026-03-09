import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Samurai Japanese Language Training Center — our mission, language teaching, student visa processing, and career counseling services.',
}

const highlights = [
  'NAT-TEST Preparation',
  'JLPT Preparation',
  'Student Visa Processing',
  'Career Counseling',
]

const sections = [
  {
    icon: '🗣️',
    title: 'Language Teaching',
    desc: 'Our certified Japanese language instructors provide structured courses from beginner (N5) to advanced (N1) levels. We use proven teaching methodologies tailored for Bangladeshi students, ensuring high JLPT pass rates and practical communication skills for life and work in Japan.',
  },
  {
    icon: '📋',
    title: 'Student Visa Processing',
    desc: 'Navigating the Japan student visa process can be complex. Our experienced consultants guide you through every step — from selecting the right school and preparing documents to submitting applications and preparing for interviews. We have successfully processed visas for hundreds of students.',
  },
  {
    icon: '🧭',
    title: 'Career Counseling',
    desc: 'Beyond language training and visas, we help students plan their careers in Japan. Our counselors advise on job markets, part-time work opportunities during studies, post-graduation work visas, and long-term settlement options — ensuring you make the most of your time in Japan.',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            About Our School
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            Samurai Japanese Language Training Center is one of the best Japanese language
            learning centers &amp; student visa consultancy firms in Bangladesh. Established in 2020,
            we offer comprehensive educational services to Bangladeshi students who intend to
            study in Japan and other developed countries. Our dedicated team of language
            instructors and visa consultants work together to ensure each student&apos;s success.
          </p>
        </div>
      </section>

      {/* Highlight Bar */}
      <section className="bg-primary py-6" aria-label="Key services highlight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white font-semibold text-sm">
            {highlights.map((item, idx) => (
              <span key={item} className="flex items-center gap-2">
                {idx > 0 && <span className="hidden md:inline text-white/40">|</span>}
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Sections */}
      <section className="bg-white py-20" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="services-heading" className="section-heading">What We Do</h2>
            <p className="section-subheading mx-auto">
              We provide end-to-end support for students aspiring to study and work in Japan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <article
                key={section.title}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary transition-colors"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{section.icon}</div>
                <h3 className="text-xl font-bold text-secondary mb-3">{section.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{section.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20" aria-labelledby="mission-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="mission-heading" className="section-heading">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To empower students of all backgrounds with Japanese language skills and the
                support they need to successfully study and build careers in Japan. We bridge
                the gap between aspiration and achievement — from language learning through
                to visa success and beyond.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that every student deserves clear, honest guidance. At Samurai JLTC,
                we don&apos;t just teach Japanese — we walk with you every step of the way toward
                your dreams.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-secondary mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To be the most trusted Japanese language training center and student visa
                consultancy in Bangladesh, recognized for our exceptional outcomes and
                student-centered approach.
              </p>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <span className="text-3xl" aria-hidden="true">⛩</span>
                <p className="text-secondary font-medium italic">
                  &ldquo;Your first step to Japan starts here.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          <h2 className="text-3xl font-bold mb-4">Ready to Take the First Step?</h2>
          <p className="text-gray-300 mb-8">
            Contact us today to learn more about our courses, visa services, and how we can
            help you achieve your dreams in Japan.
          </p>
          <Link href="/contact" className="btn-primary text-base">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  )
}

