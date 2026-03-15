import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Japanese language training, student visa support, SSW and working visa support, air ticket service, and related consultancy.',
}

const visaServices = [
  {
    id: 'japan-student-visa',
    title: 'Japan Student Visa',
    description: 'Student Visa A to Z support for Japan including counseling, document review, and interview preparation.',
  },
  {
    id: 'ssw-visa',
    title: 'SSW Visa',
    description: 'Specific Skilled Worker (SSW) visa consultancy and end-to-end processing guidance.',
  },
  {
    id: 'working-visa',
    title: 'Working Visa',
    description: 'TITP, Engineer/Humanities/International Service visa support for skilled applicants.',
  },
  {
    id: 'malaysia-student-visa',
    title: 'Malaysia Student Visa',
    description: 'Guidance and processing support for students aiming to study in Malaysia.',
  },
  {
    id: 'air-ticket-service',
    title: 'Air Ticket Service',
    description: 'Travel support and ticketing assistance for students and professionals.',
  },
]

const additionalServices = [
  'Business Visa (Setup Company & Invest in Japan with Visa)',
  'Design Solutions (Architecture, Interior)',
  'IT Solutions (System Security, Web Development, Software, Hardware)',
]

export default function ServicesPage() {
  return (
    <>
      <section className="bg-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">Our Services</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-3xl">
            Language Course & Visa Consultancy
          </h1>
          <p className="text-gray-300 text-lg max-w-4xl leading-relaxed">
            Japanese Language Course (N5-N4 and JFT), Student Visa support, Working Visa pathways, and broader
            consultancy services for students and professionals.
          </p>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="service-menu-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="service-menu-heading" className="section-heading text-center mb-10">Service Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visaServices.map((service) => (
              <article key={service.id} id={service.id} className="rounded-2xl border border-gray-200 p-6 bg-gray-50">
                <h3 className="text-xl font-bold text-secondary mb-2">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16" aria-labelledby="extra-services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="extra-services-heading" className="section-heading mb-8">Additional Services</h2>
          <div className="space-y-3 text-gray-700">
            {additionalServices.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="course-pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="course-pricing-heading" className="section-heading mb-8">Language Course Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-secondary mb-2">Beginner (N5-N4)</h3>
              <p className="text-gray-600 mb-3">For complete beginners with foundational reading, writing, and speaking.</p>
              <p className="font-semibold text-secondary">N5: 99,000 BDT</p>
              <p className="font-semibold text-secondary">N4: 120,000 BDT</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-secondary mb-2">Intermediate (N3)</h3>
              <p className="text-gray-600 mb-3">Daily conversation and practical communication skills for real contexts.</p>
              <p className="font-semibold text-secondary">N3: 150,000 BDT</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-secondary mb-2">Advanced (N2-N1)</h3>
              <p className="text-gray-600 mb-3">Fluent speaking, advanced writing, and job-hunting preparation support.</p>
              <p className="font-semibold text-secondary">N2: 180,000 BDT</p>
              <p className="font-semibold text-secondary">N1: 200,000 BDT</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
