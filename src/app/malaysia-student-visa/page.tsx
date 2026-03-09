import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Malaysia Student Visa',
  description:
    'Malaysia student visa support from Samurai JLTC — affordable study options, university applications, and complete visa processing for Bangladeshi students.',
}

const benefits = [
  { icon: '💰', title: 'Affordable Tuition', desc: 'Malaysia offers world-class education at significantly lower costs compared to Japan, USA, UK, or Australia.' },
  { icon: '🌏', title: 'English Medium Programs', desc: 'Many Malaysian universities offer programs entirely in English, making it accessible for Bangladeshi students.' },
  { icon: '✈️', title: 'Easy Travel Access', desc: 'Malaysia\'s central location in Southeast Asia makes it an excellent base for travel and career opportunities across the region.' },
  { icon: '🏢', title: 'Part-Time Work', desc: 'Student visa holders in Malaysia can work part-time during semester breaks under certain conditions.' },
]

const steps = [
  { step: '01', title: 'University Selection', desc: 'We help you choose the right Malaysian university or college based on your academic qualifications, budget, and career goals.' },
  { step: '02', title: 'Application Submission', desc: 'We prepare and submit your university application with all required academic transcripts, certificates, and supporting documents.' },
  { step: '03', title: 'Offer Letter', desc: 'Once accepted, the university issues a conditional or unconditional offer letter — we guide you through any conditions that need to be met.' },
  { step: '04', title: 'Visa Application (eVAL)', desc: 'We assist with the Malaysia student pass application through the Education Malaysia Global Services (EMGS) portal and the eVAL system.' },
  { step: '05', title: 'Health Screening', desc: 'Guide you through the required medical examination and health screening at an approved EMGS panel clinic in Bangladesh.' },
  { step: '06', title: 'Departure Preparation', desc: 'Pre-departure briefing on Malaysian culture, accommodation, transportation, banking, and university registration procedures.' },
]

export default function MalaysiaStudentVisaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Study Abroad
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            Malaysia Student Visa
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Malaysia is one of Asia&apos;s leading education destinations — affordable, diverse,
            and internationally recognised. We provide complete support for Malaysian student
            visas from application to arrival.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="benefits-heading" className="section-heading">Why Study in Malaysia?</h2>
            <p className="section-subheading mx-auto">
              Malaysia offers a high quality of life, world-class universities, and a
              welcoming environment for international students.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary transition-colors text-center"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
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
              From university selection to arrival in Malaysia, we support you at every step.
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
            Ready to Study in Malaysia?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contact us today for a free consultation about studying in Malaysia and
            how we can help you get your student visa.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
