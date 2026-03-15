import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services#japan-student-visa', label: 'Japan Student Visa' },
  { href: '/services#ssw-visa', label: 'SSW Visa' },
  { href: '/services#working-visa', label: 'Working Visa' },
  { href: '/services#malaysia-student-visa', label: 'Malaysia Student Visa' },
  { href: '/services#air-ticket-service', label: 'Air Ticket Service' },
  { href: '/contact', label: 'Contact Home' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-gold transition-colors mb-4">
              <span aria-hidden="true">⛩</span>
              <span>Samurai Japanese Language Training Center</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Samurai Japanese Language Training Center is one of the best Japanese language learning centers and
              student visa consultancy firms in Bangladesh. We offer comprehensive educational services to Bangladeshi
              students who intend to study in Japan and other developed countries.
            </p>
            <p className="mt-3 text-gray-400 text-sm">
              NAT-TEST Preparation | JLPT Preparation | Student Visa Processing | Career Counseling
            </p>
          </div>

          <div>
            <h2 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">Quick Menu</h2>
            <ul className="space-y-2" role="list">
              {footerLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">Our Offices</h2>
            <address className="not-italic space-y-4 text-gray-300 text-sm">
              <div>
                <p className="font-semibold text-white">Bangladesh Office</p>
                <p>House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212</p>
                <p>Mobile: 01601687773, 01967016700</p>
              </div>
              <div>
                <p className="font-semibold text-white">Japan Office</p>
                <p>Tokyo-to Kita-ku Akabane Nishi 4-35-5 Sakauekup 101</p>
                <p>Mobile: +81 70-9039-4475</p>
                <p>
                  E-Mail:{' '}
                  <a href="mailto:miahsuzan818@gmail.com" className="hover:text-white transition-colors">
                    miahsuzan818@gmail.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col gap-3 text-sm text-gray-400">
          <p>© 2023 Samurai Japanese Language Training Center. All rights reserved.</p>
          <p>
            {year >= 2024 ? `Updated ${year} • ` : ''}
            Samurai Japanese Language Training Center is one of the best Japanese language learning centers and student
            visa consultancy firms in Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  )
}
