import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-white hover:text-gold transition-colors mb-4"
            >
              <span aria-hidden="true">⛩</span>
              <span>Samurai JLTC</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your gateway to mastering the Japanese language. Expert instructors, proven
              methods, real results.
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
            <address className="not-italic space-y-2 text-gray-400 text-sm">
              <p>📍 123 Sakura Street, Tokyo District</p>
              <p>
                📧{' '}
                <a
                  href="mailto:info@samurai-jltc.com"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded"
                >
                  info@samurai-jltc.com
                </a>
              </p>
              <p>
                📞{' '}
                <a
                  href="tel:+81000000000"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded"
                >
                  +81 (0) 00-0000-0000
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year} Samurai JLTC. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for Japanese learners worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
