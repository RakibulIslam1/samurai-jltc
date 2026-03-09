import Link from 'next/link'

const services = [
  { icon: '🇯🇵', title: 'Japanese Language Training', desc: 'Comprehensive Japanese language courses from N5 beginner level to N1 advanced, taught by experienced instructors.' },
  { icon: '🎓', title: 'Student Visa A to Z Support', desc: 'Complete guidance for Japan student visa applications — documentation, interviews, and follow-up.' },
  { icon: '🏭', title: 'TITP, SSW & Engineer/Humanities/International Service Visa', desc: 'Specialist visa processing for technical trainees, specified skilled workers, and professional workers.' },
  { icon: '💼', title: 'Business Visa (Setup Company & Invest in Japan with Visa)', desc: 'Support for entrepreneurs and investors who want to establish companies or invest in Japan.' },
  { icon: '🏗️', title: 'Design Solutions', desc: 'Architecture and interior design services to help you establish your presence in Japan.' },
  { icon: '💻', title: 'IT Solutions', desc: 'System security, web development, software and hardware solutions for individuals and businesses.' },
]

const whyJapan = [
  { icon: '🌏', title: '3rd Largest Economy', desc: 'Japan boasts the world\'s third-largest economy, offering outstanding career and business opportunities.' },
  { icon: '🤖', title: 'Hi-Tech Country', desc: 'Be at the cutting edge of technology — Japan is a global leader in robotics, engineering, and innovation.' },
  { icon: '💴', title: 'High Part-Time Salary', desc: 'Students can work part-time with competitive wages, helping to offset living and study expenses.' },
  { icon: '✈️', title: 'Visa-Free Access', desc: 'A Japanese residency or citizenship opens doors to visa-free or visa-on-arrival access to many countries.' },
]

const courses = [
  {
    level: 'Beginner Level (N5–N4)',
    badge: 'Beginner',
    badgeColor: 'bg-green-100 text-green-800',
    bullets: [
      'Hiragana, Katakana & essential Kanji',
      'Basic grammar and sentence structure',
      'Everyday vocabulary and conversation',
      'JLPT N5 & N4 exam preparation',
    ],
    pricing: [
      { name: 'N5', price: '99,000 BDT' },
      { name: 'N4', price: '120,000 BDT' },
    ],
  },
  {
    level: 'Intermediate (N3)',
    badge: 'Intermediate',
    badgeColor: 'bg-blue-100 text-blue-800',
    bullets: [
      'Expanded vocabulary and complex grammar',
      'Reading comprehension and writing skills',
      'Practical communication for daily life',
      'JLPT N3 exam preparation',
    ],
    pricing: [
      { name: 'N3', price: '150,000 BDT' },
    ],
  },
  {
    level: 'Advanced (N2–N1)',
    badge: 'Advanced',
    badgeColor: 'bg-purple-100 text-purple-800',
    bullets: [
      'Nuanced grammar and formal language registers',
      'Advanced Kanji and sophisticated reading',
      'Academic and professional Japanese',
      'JLPT N2 & N1 exam preparation',
    ],
    pricing: [
      { name: 'N2', price: '180,000 BDT' },
      { name: 'N1', price: '200,000 BDT' },
    ],
  },
]

const qualifications = [
  { icon: '📚', title: 'HSC / Alim / Diploma and Equivalent', desc: 'Students who have completed higher secondary, alim, diploma, or equivalent qualifications are eligible to apply.' },
  { icon: '🎓', title: 'Honours / Masters Degrees', desc: 'University graduates with honours or masters degrees are welcome to apply for our advanced programs.' },
  { icon: '📅', title: 'Maximum 5 Years Gap in Studies', desc: 'Applicants with up to a 5-year gap since their last qualification are eligible for our programs.' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-end pr-8 md:pr-16">
          <span className="text-[20rem] font-bold leading-none text-white">侍</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
              Started 2020 &nbsp;·&nbsp; Samurai Japanese Language Training Center
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Your First Step{' '}
              <span className="text-primary">to Japan</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
              One of the best Japanese language learning centers &amp; student visa consultancy
              firms in Bangladesh. We offer comprehensive educational services to Bangladeshi
              students who intend to study in Japan and other developed countries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary text-base">
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-secondary transition-colors duration-200"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* Our Services */}
      <section className="bg-white py-20" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="services-heading" className="section-heading">Our Services</h2>
          <p className="section-subheading mx-auto mb-12">
            We provide a complete range of services to support your journey to Japan — from
            language training to visa consultancy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <article
                key={service.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{service.icon}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Study in Japan */}
      <section className="bg-primary py-20" aria-labelledby="why-japan-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="why-japan-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Study in Japan?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-12">
            Japan offers world-class education, a thriving economy, and incredible career
            opportunities for international students.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJapan.map((item) => (
              <div
                key={item.title}
                className="bg-white/10 rounded-2xl p-6 text-left border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Levels */}
      <section className="bg-gray-50 py-20" aria-labelledby="courses-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="courses-heading" className="section-heading">Course Levels</h2>
            <p className="section-subheading mx-auto">
              Our structured curriculum covers all JLPT levels with dedicated pricing for
              each stage of your Japanese language journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <article
                key={course.level}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-4">{course.level}</h3>
                <ul className="space-y-2 mb-6 flex-1">
                  {course.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary font-bold mt-0.5" aria-hidden="true">✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {course.pricing.map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <span className="font-semibold text-secondary text-sm">{p.name}</span>
                      <span className="text-primary font-bold">{p.price}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn-primary text-sm py-2 text-center mt-6">
                  Enroll Now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Qualifications */}
      <section className="bg-white py-20" aria-labelledby="qualifications-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="qualifications-heading" className="section-heading">
              Educational Qualification Requirements
            </h2>
            <p className="section-subheading mx-auto">
              To apply for our programs, applicants must meet one of the following educational
              requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualifications.map((q) => (
              <div
                key={q.title}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary transition-colors"
              >
                <span className="text-4xl mt-1" aria-hidden="true">{q.icon}</span>
                <div>
                  <h3 className="font-bold text-secondary mb-2">{q.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{q.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Join hundreds of students who have transformed their futures through Japanese
            language training and visa support with Samurai JLTC.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base">
              Contact Us Now
            </Link>
            <Link
              href="/japan-student-visa"
              className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-secondary transition-colors duration-200"
            >
              Japan Student Visa
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

