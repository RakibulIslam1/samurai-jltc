'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/japan-student-visa', label: 'Japan Student Visa' },
  { href: '/ssw-visa', label: 'SSW Visa' },
  { href: '/working-visa', label: 'Working Visa' },
  { href: '/malaysia-student-visa', label: 'Malaysia Student Visa' },
  { href: '/air-ticket-service', label: 'Air Ticket Service' },
  { href: '/contact', label: 'Contact Us' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-secondary hover:text-primary transition-colors shrink-0"
          aria-label="Samurai JLTC – Home"
        >
          <span aria-hidden="true">⛩</span>
          <span className="hidden sm:inline">Samurai JLTC</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden xl:flex items-center gap-4" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-medium text-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded ${
                  pathname === link.href
                    ? 'text-primary border-b-2 border-primary pb-0.5'
                    : 'text-secondary'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden xl:flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm py-2">
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="xl:hidden p-2 rounded-lg text-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span aria-hidden="true" className="block text-2xl">
            {menuOpen ? '✕' : '☰'}
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="xl:hidden bg-white border-t border-gray-200 px-4 py-4"
        >
          <ul className="flex flex-col gap-3" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-2 py-1 ${
                    pathname === link.href ? 'text-primary' : 'text-secondary'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="btn-primary text-sm py-2 text-center block mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

