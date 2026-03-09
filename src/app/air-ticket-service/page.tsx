import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Air Ticket Service',
  description:
    'Air ticket booking service from Samurai JLTC — competitive fares, Japan routes, group bookings, and travel support for students and visa applicants.',
}

const features = [
  { icon: '✈️', title: 'Competitive Fares', desc: 'We source the best available fares for Dhaka–Tokyo, Dhaka–Osaka, Dhaka–Kuala Lumpur, and other major routes popular with our students.' },
  { icon: '🎫', title: 'Group Bookings', desc: 'Travelling with other students? We arrange discounted group bookings and coordinate travel so your cohort arrives together.' },
  { icon: '🕐', title: 'Flexible Dates', desc: 'We help you find flexible-date tickets that align with your school admission date, visa validity, and personal schedule.' },
  { icon: '🛂', title: 'Transit Guidance', desc: 'We advise on transit requirements, baggage allowances, immigration procedures, and what to expect on arrival in Japan or Malaysia.' },
  { icon: '🔁', title: 'Return Tickets', desc: 'We arrange return and open-jaw tickets for students who need to come home for holidays or after graduation.' },
  { icon: '📞', title: '24/7 Support', desc: 'Our team is available to assist with changes, cancellations, or emergencies before and during your travel.' },
]

const popularRoutes = [
  { from: 'Dhaka (DAC)', to: 'Tokyo Narita (NRT)', airlines: 'Biman, ANA, Cathay Pacific, Thai Airways' },
  { from: 'Dhaka (DAC)', to: 'Osaka Kansai (KIX)', airlines: 'Biman, Japan Airlines, Singapore Airlines' },
  { from: 'Dhaka (DAC)', to: 'Nagoya (NGO)', airlines: 'Various connecting flights via Bangkok, Singapore' },
  { from: 'Dhaka (DAC)', to: 'Kuala Lumpur (KUL)', airlines: 'Biman, Malaysia Airlines, AirAsia' },
]

export default function AirTicketServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Travel Services
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            Air Ticket Service
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            We provide reliable air ticket booking services for students and visa applicants
            travelling to Japan, Malaysia, and other destinations — with competitive fares
            and expert travel guidance.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="section-heading">Why Book With Us?</h2>
            <p className="section-subheading mx-auto">
              As a one-stop service for students going abroad, we make your travel
              arrangements as smooth as your visa process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary transition-colors"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{feature.icon}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-gray-50 py-20" aria-labelledby="routes-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="routes-heading" className="section-heading">Popular Routes</h2>
            <p className="section-subheading mx-auto">
              We book tickets on all major airlines serving these popular student routes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularRoutes.map((route) => (
              <div
                key={route.to}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary transition-colors flex items-center gap-6"
              >
                <div className="text-3xl" aria-hidden="true">✈️</div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-secondary">{route.from}</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="font-bold text-secondary">{route.to}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{route.airlines}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Book Your Ticket Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contact us to get the best available fares for your destination and
            travel date. We handle the booking, you focus on the journey.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Contact Us for Booking
          </Link>
        </div>
      </section>
    </>
  )
}
