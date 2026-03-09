import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/japan-student-visa', label: 'Japan Student Visa' },
  { href: '/ssw-visa', label: 'SSW Visa' },
  { href: '/working-visa', label: 'Working Visa' },
  { href: '/malaysia-student-visa', label: 'Malaysia Student Visa' },
  { href: '/air-ticket-service', label: 'Air Ticket Service' },
  { href: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-white hover:text-gold transition-colors mb-4"
            >
              <span aria-hidden="true">⛩</span>
              <span>Samurai JLTC</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Samurai Japanese Language Training Center — one of the best Japanese language learning
              centers &amp; student visa consultancy firms in Bangladesh. We offer comprehensive
              educational services to Bangladeshi students who intend to study in Japan and other
              developed countries.
            </p>
            <p className="text-gold text-sm font-semibold">
              Start 2020 &nbsp;·&nbsp; Empowering Futures
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2" role="list">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h2>
            <address className="not-italic space-y-3 text-gray-400 text-sm">
              <div>
                <p className="text-white font-semibold text-xs uppercase tracking-wider mb-1">Bangladesh Office</p>
                <p>📍 House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212</p>
                <p>📞 <a href="tel:+8801601687773" className="hover:text-white transition-colors">01601687773</a></p>
                <p>📞 <a href="tel:+8801967016700" className="hover:text-white transition-colors">01967016700</a></p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs uppercase tracking-wider mb-1">Japan Office</p>
                <p>📍 Tokyo to Kita ku Akabane Nishi 4-35-5 Sakauekup101</p>
                <p>📞 <a href="tel:+817090394475" className="hover:text-white transition-colors">+81 70-9039-4475</a></p>
              </div>
              <p>
                📧{' '}
                <a
                  href="mailto:miahsuzan818@gmail.com"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded"
                >
                  miahsuzan818@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2023 Samurai Japanese Language Training Center. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for Japanese learners worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}

