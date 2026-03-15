import Link from 'next/link'

const services = [
  'Japanese Language Training',
  'Student Visa A to Z Support',
  'TITP, SSW & Engineer/Humanities/International Service Visa',
  'Business Visa (Setup Company & Invest in Japan with Visa)',
  'Design Solutions (Architecture, Interior)',
  'IT Solutions (System Security, Web Development, Software, Hardware)',
]

const whyStudyInJapan = [
  {
    title: '3rd Largest Economy',
    description: 'Japan is the 3rd largest developed economy in the modern world.',
  },
  {
    title: 'Hi-Tech Country',
    description: 'Maximum hi-tech used country with advanced technology.',
  },
  {
    title: 'High Part-Time Salary',
    description: 'Average salary for part-time jobs is very high compared to other countries.',
  },
  {
    title: 'Visa-Free Access',
    description: 'Japanese passport allows access to more than 100 countries without visa.',
  },
]

const courseLevels = [
  {
    title: 'Beginner Level (N5-N4)',
    subtitle: 'For Complete Beginners',
    details: [
      'Learning basic Japanese and basic short conversation in daily life.',
      'Conversation, vocabulary, grammar, reading, writing, kanji writing, and listening.',
      'Introduction to Japanese culture.',
    ],
    fees: ['N5: 99,000 BDT', 'N4: 120,000 BDT'],
  },
  {
    title: 'Intermediate Level (N3)',
    subtitle: 'Daily Conversation Possible',
    details: [
      'Using grammar structure, phrases, and vocabulary for daily communication.',
      'More complex grammar and expressions.',
      'Reading newspaper and magazine articles with basic business Japanese situations.',
    ],
    fees: ['N3: 150,000 BDT'],
  },
  {
    title: 'Advanced Level (N2-N1)',
    subtitle: 'Fluent Speaking Level',
    details: [
      'To speak fluently, students learn advanced N2 or N1 Japanese.',
      'Discussion on specialized topics and university-level reading/essay writing.',
      'Business Japanese and job hunting preparation.',
    ],
    fees: ['N2: 180,000 BDT', 'N1: 200,000 BDT'],
  },
]

export default function HomePage() {
  return (
    <>
      <section className="relative bg-secondary text-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Samurai Japanese Language Training Center • Start 2020
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Your First Step to Japan
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed mb-8">
            One of the best Japanese language learning centers and student visa consultancy firms in Bangladesh.
            We offer comprehensive educational services to Bangladeshi students who intend to study in Japan
            and other developed countries.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/services" className="btn-primary text-base">
              Our Services
            </Link>
            <Link href="/contact" className="btn-secondary text-base">
              Contact Home
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="our-services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="our-services-heading" className="section-heading mb-8 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((item) => (
              <div key={item} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-secondary font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16" aria-labelledby="about-school-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="about-school-heading" className="section-heading mb-4">About Our School</h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            Samurai Japanese Language Training Center is one of the best Japanese language learning centers and
            student visa consultancy firms in Bangladesh. We provide language teaching, student visa processing,
            and career counseling for students aiming to study and build careers in Japan and other developed countries.
          </p>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="why-japan-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="why-japan-heading" className="section-heading text-center mb-10">Why Study in Japan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyStudyInJapan.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
                <h3 className="text-xl font-bold text-secondary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16" aria-labelledby="course-levels-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="course-levels-heading" className="section-heading text-center mb-10">Japanese Language Course Levels</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {courseLevels.map((course) => (
              <article key={course.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-bold text-secondary mb-1">{course.title}</h3>
                <p className="text-primary font-semibold text-sm mb-4">{course.subtitle}</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4" role="list">
                  {course.details.map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>
                <div className="space-y-1">
                  {course.fees.map((fee) => (
                    <p key={fee} className="font-semibold text-secondary">{fee}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="qualification-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="qualification-heading" className="section-heading mb-6">Educational Qualification Requirements</h2>
          <ul className="space-y-3 text-gray-700" role="list">
            <li>• HSC/Alim/Diploma and equivalent</li>
            <li>• Honours / Masters Degrees</li>
            <li>• Maximum 5 years gap in studies</li>
          </ul>
        </div>
      </section>

      <section className="bg-secondary text-white py-16" aria-labelledby="office-address-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 id="office-address-heading" className="text-2xl font-bold mb-3">Bangladesh Office</h2>
            <p className="text-gray-300">House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212</p>
            <p className="text-gray-300 mt-2">Mobile: 01601687773, 01967016700</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Japan Office</h3>
            <p className="text-gray-300">Tokyo-to Kita-ku Akabane Nishi 4-35-5 Sakauekup 101</p>
            <p className="text-gray-300 mt-2">Mobile: +81 70-9039-4475</p>
            <p className="text-gray-300 mt-2">Email: miahsuzan818@gmail.com</p>
          </div>
        </div>
      </section>
    </>
  )
}
