import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Japan Student Visa',
  description:
    'Complete Japan student visa support from Samurai JLTC — document preparation, school selection, interview coaching, and end-to-end application assistance.',
}

const steps = [
  { step: '01', title: 'Initial Consultation', desc: 'Meet with our visa consultants to assess your eligibility, discuss your academic goals, and choose the right Japanese language school or university.' },
  { step: '02', title: 'School Application', desc: 'We assist you in applying to accredited Japanese language schools or universities and handle all communication with institutions on your behalf.' },
  { step: '03', title: 'Document Preparation', desc: 'Our team prepares and reviews all required documents: Certificate of Eligibility application, financial statements, academic records, and more.' },
  { step: '04', title: 'Certificate of Eligibility', desc: 'We liaise with the Japanese immigration authorities to obtain the Certificate of Eligibility (COE), the critical first step in the student visa process.' },
  { step: '05', title: 'Visa Application', desc: 'Once the COE is received, we guide you through the visa application at the Embassy of Japan in Bangladesh, including all required forms and supporting documents.' },
  { step: '06', title: 'Pre-Departure Support', desc: 'After visa approval, we provide guidance on travel arrangements, accommodation in Japan, airport pickup coordination, and initial settlement support.' },
]

const requirements = [
  'HSC / Alim / Diploma or equivalent qualification',
  'Honours or Masters degree (for higher-level programs)',
  'Maximum 5-year gap in studies',
  'Proof of sufficient funds (personal or sponsored)',
  'Valid passport with at least 18 months remaining',
  'Medical fitness certificate',
  'N5 or higher JLPT certificate (for some schools)',
]

export default function JapanStudentVisaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Visa Services
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            Japan Student Visa
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            We provide complete A to Z support for Japan student visas — from school selection
            and document preparation to Certificate of Eligibility and final visa approval.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-20" aria-labelledby="overview-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="overview-heading" className="section-heading">
                Study in Japan with Confidence
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Japan offers world-class education, cutting-edge research opportunities, and
                a rich cultural experience. As a student visa holder, you can also work
                part-time (up to 28 hours per week) to support your living expenses.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our experienced consultants have successfully processed hundreds of Japan
                student visa applications. We know exactly what Japanese immigration
                authorities look for and ensure your application is prepared to the
                highest standard.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-4">Eligibility Requirements</h3>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-primary font-bold mt-0.5" aria-hidden="true">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Steps */}
      <section className="bg-gray-50 py-20" aria-labelledby="steps-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="steps-heading" className="section-heading">Our Process</h2>
            <p className="section-subheading mx-auto">
              We handle every step of your Japan student visa application — you focus on
              preparing for your new life in Japan.
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
            Ready to Start Your Japan Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contact us today for a free consultation and let our experts guide you
            through every step of the student visa process.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
