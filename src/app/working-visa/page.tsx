import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Working Visa Japan',
  description:
    'Japan working visa support from Samurai JLTC — Engineer/Humanities/International Service visa, business visa, and professional work permit assistance.',
}

const visaTypes = [
  {
    icon: '💻',
    title: 'Engineer / Humanities / International Service',
    desc: 'For professionals in IT, engineering, finance, education, translation, and international business roles. Requires a relevant degree or 10+ years of professional experience.',
  },
  {
    icon: '💼',
    title: 'Business Manager Visa',
    desc: 'For entrepreneurs and investors who wish to establish or manage a business in Japan. Requires a minimum capital investment and a physical business office in Japan.',
  },
  {
    icon: '🏭',
    title: 'Technical Intern Training Program (TITP)',
    desc: 'Allows workers to gain technical skills and experience in Japan\'s industries. Training is conducted at a designated organization for up to 5 years.',
  },
  {
    icon: '🎓',
    title: 'Highly Skilled Professional Visa',
    desc: 'For highly qualified professionals in advanced academic research, advanced specialist/technical work, or advanced business management. Offers accelerated permanent residency.',
  },
]

const steps = [
  { step: '01', title: 'Eligibility Review', desc: 'We assess your qualifications, work experience, and Japanese language ability to identify the most suitable working visa category for you.' },
  { step: '02', title: 'Employer / Sponsor Matching', desc: 'We help connect you with Japanese companies that are registered to sponsor working visas for foreign nationals.' },
  { step: '03', title: 'Document Preparation', desc: 'Preparation of all required documents: employment contract, company registration documents, resume/CV, educational certificates, and more.' },
  { step: '04', title: 'Certificate of Eligibility', desc: 'Application for the Certificate of Eligibility (COE) through the Japanese immigration bureau — a critical step before the visa application.' },
  { step: '05', title: 'Visa Application', desc: 'Submission of the working visa application at the Embassy of Japan in Bangladesh, with our team reviewing every document for accuracy.' },
  { step: '06', title: 'Pre-Departure Guidance', desc: 'Comprehensive briefing on working life in Japan, social insurance, tax registration, accommodation, and cultural workplace norms.' },
]

export default function WorkingVisaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Professional Visas
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            Working Visa for Japan
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Whether you are an IT professional, engineer, business owner, or technical
            trainee — we provide expert guidance for all Japan working visa categories.
          </p>
        </div>
      </section>

      {/* Visa Types */}
      <section className="bg-white py-20" aria-labelledby="types-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="types-heading" className="section-heading">Working Visa Categories</h2>
            <p className="section-subheading mx-auto">
              Japan offers various working visa categories depending on your profession,
              qualifications, and purpose of stay.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visaTypes.map((visa) => (
              <article
                key={visa.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary transition-colors"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{visa.icon}</div>
                <h3 className="text-xl font-bold text-secondary mb-2">{visa.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{visa.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Key Steps */}
      <section className="bg-gray-50 py-20" aria-labelledby="steps-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="steps-heading" className="section-heading">Our Process</h2>
            <p className="section-subheading mx-auto">
              We manage every step of your working visa application so you can focus on
              preparing for your new career in Japan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary transition-colors"
              >
                <div className="text-3xl font-extrabold text-primary/20 mb-3">{step.step}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work in Japan?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contact us today for a free consultation and let our experts guide you
            through the Japan working visa process.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
