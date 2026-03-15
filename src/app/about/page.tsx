import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Samurai Japanese Language Training Center is a Japanese language institute and student visa consultancy firm for Bangladesh students.',
}

const coreAreas = [
  {
    title: 'Language Teaching',
    description: 'Comprehensive Japanese courses from JLPT N5 to N1 level by experienced native and bilingual teachers.',
  },
  {
    title: 'Student Visa Processing',
    description: 'Complete support for Japan student visa applications, from documentation to interview preparation.',
  },
  {
    title: 'Career Counseling',
    description: 'Guidance on school selection, part-time job opportunities, and post-graduation employment support.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-3xl">
            About Our School
          </h1>
          <p className="text-gray-300 text-lg max-w-4xl leading-relaxed">
            Samurai Japanese Language Training Center is one of the best Japanese language learning centers and
            student visa consultancy firms in Bangladesh. We offer comprehensive educational services to Bangladeshi
            students who have the intention of studying in Japan and other developed countries.
          </p>
        </div>
      </section>

      <section className="bg-white py-20" aria-labelledby="core-services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="core-services-heading" className="section-heading text-center mb-12">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreAreas.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20" aria-labelledby="mission-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="mission-heading" className="section-heading mb-6">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl mb-4">
            We focus on quality Japanese language education, transparent consultancy, and complete student support.
            From beginner-level learning to visa preparation and career guidance, our goal is to make each student
            confident and ready for international opportunities.
          </p>
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            NAT-TEST Preparation, JLPT Preparation, Student Visa Processing, and Career Counseling are the key areas
            where we deliver practical and result-driven support.
          </p>
        </div>
      </section>
    </>
  )
}
