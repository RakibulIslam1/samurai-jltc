import Link from 'next/link'

const stats = [
  { value: '2020', label: 'Established' },
  { value: 'N5-N1', label: 'Course Range' },
  { value: 'A to Z', label: 'Visa Support' },
]

const features = [
  {
    icon: '👨‍🏫',
    title: 'Japanese Language Training',
    description:
      'Comprehensive Japanese language course support from beginner to advanced level including N5-N4 and JFT pathways.',
  },
  {
    icon: '🗓️',
    title: 'Student Visa A to Z Support',
    description:
      'Complete student visa processing support from document preparation to interview guidance for Japan and other destinations.',
  },
  {
    icon: '📜',
    title: 'SSW, TITP & Working Visa',
    description:
      'Support for TITP, SSW, and Engineer/Humanities/International Service visa categories with practical consulting.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-end pr-8 md:pr-16">
          <span className="text-[20rem] font-bold leading-none text-white">語</span>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
              Samurai Japanese Language Training Center • Start 2020
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Your First Step to Japan
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
              One of the best Japanese language learning centers and student visa consultancy firms in Bangladesh. We offer comprehensive educational services to Bangladeshi students who intend to study in Japan and other developed countries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="btn-primary text-base">
                Our Services
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-secondary transition-colors duration-200"
              >
                Contact Home
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* Stats */}
      <section className="bg-white py-16" aria-label="Key statistics">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary transition-colors"
              >
                <dt className="text-4xl font-extrabold text-primary mb-2">{stat.value}</dt>
                <dd className="text-gray-600 font-medium">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-gray-50 py-20" aria-labelledby="why-us-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="why-us-heading" className="section-heading">
            Why Study in Japan?
          </h2>
          <p className="section-subheading mx-auto mb-12">
            Japan is one of the best destinations for students due to economy, technology, earning opportunities, and global mobility.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary transition-all duration-200 text-left"
              >
                <div
                  className="text-4xl mb-4"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Japanese Characters Banner */}
      <section className="bg-primary py-10 overflow-hidden" aria-hidden="true">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/30 text-6xl md:text-8xl font-bold tracking-widest select-none">
            日本語&nbsp;&nbsp;学習&nbsp;&nbsp;侍
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-white py-20" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="section-heading">
            Educational Qualification Requirements
          </h2>
          <p className="section-subheading mx-auto mb-10">
            HSC/Alim/Diploma and equivalent, Honours or Masters degree, and maximum 5 years gap in studies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base">
              Enroll Now
            </Link>
            <Link href="/about" className="btn-secondary text-base">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
