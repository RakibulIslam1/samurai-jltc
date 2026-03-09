import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SSW Visa — Specified Skilled Worker',
  description:
    'SSW (Specified Skilled Worker) visa support from Samurai JLTC — skills evaluation, Japanese language testing, and complete visa processing for Bangladesh applicants.',
}

const sectors = [
  'Nursing Care (介護)', 'Building Cleaning Management', 'Material Processing Industry',
  'Industrial Machinery Manufacturing', 'Electric/Electronic Information Industry',
  'Construction Industry', 'Shipbuilding / Ship Machinery Industry',
  'Automobile Repair / Maintenance', 'Aviation Industry',
  'Accommodation Industry', 'Agriculture', 'Fishery / Aquaculture',
  'Food & Beverage Manufacturing', 'Food Service Industry',
]

const steps = [
  { step: '01', title: 'Eligibility Assessment', desc: 'We evaluate your work experience, skills, and Japanese language ability to determine which SSW sectors you qualify for.' },
  { step: '02', title: 'Language & Skills Test', desc: 'Prepare for and pass the required Japanese Language Proficiency Test (JLPT N4 or higher) and the relevant sector-specific skills evaluation test (JFT-Basic or JLPT N4).' },
  { step: '03', title: 'Job Matching', desc: 'We connect you with registered Japanese employers in your sector who are looking for Specified Skilled Workers.' },
  { step: '04', title: 'Contract & Documents', desc: 'Review and sign your employment contract. We help prepare all required visa documents including the employment contract, skills certificate, and language test results.' },
  { step: '05', title: 'Visa Application', desc: 'Submit the SSW visa application at the Embassy of Japan in Bangladesh with our expert guidance and document review.' },
  { step: '06', title: 'Arrival Support', desc: 'Pre-departure briefing on life in Japan, accommodation, bank accounts, transportation, and cultural orientation.' },
]

export default function SSWVisaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Work in Japan
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            SSW Visa (Specified Skilled Worker)
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            The SSW visa allows skilled workers to live and work in Japan in designated
            industry sectors. We provide full support from skills testing to visa approval.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-20" aria-labelledby="overview-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="overview-heading" className="section-heading">
                Work Legally in Japan with SSW
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Japan&apos;s Specified Skilled Worker (SSW) program was introduced in 2019 to
                address critical labour shortages in 14 designated industrial sectors.
                SSW-1 allows a 5-year stay (renewable); SSW-2 allows indefinite stay with
                a path to permanent residency.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Samurai JLTC provides comprehensive preparation including Japanese language
                coaching, skills test preparation, employer matching, and complete visa
                application support.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-4">Eligible Sectors</h3>
              <div className="grid grid-cols-1 gap-2">
                {sectors.map((sector) => (
                  <div key={sector} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-primary font-bold" aria-hidden="true">•</span>
                    {sector}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Steps */}
      <section className="bg-gray-50 py-20" aria-labelledby="steps-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="steps-heading" className="section-heading">Our SSW Process</h2>
            <p className="section-subheading mx-auto">
              Our step-by-step process ensures you are fully prepared and supported throughout
              your SSW visa journey.
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
            Start Your SSW Visa Journey
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contact us today for a free consultation about the Specified Skilled Worker
            visa and find out how we can help you work in Japan.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
