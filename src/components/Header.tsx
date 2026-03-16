'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'

const baseNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/achievement', label: 'Achievement' },
  { href: '/contact', label: 'Contact' },
]

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()

  // Admin Panel appears in the middle nav; Profile is an icon on the right — no Profile link in navLinks
  const navLinks = isAdmin
    ? [...baseNavLinks, { href: '/admin', label: 'Admin Panel' }]
    : baseNavLinks

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-secondary hover:text-primary transition-colors"
          aria-label="Samurai JLTC – Home"
        >
          <span aria-hidden="true">⛩</span>
          <span>Samurai JLTC</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link
                href={link.href}
                className={`font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded ${
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

        {/* Right-side auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className={`rounded-full p-1.5 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  pathname === '/profile' ? 'text-primary' : 'text-secondary'
                }`}
                aria-label="My Profile"
              >
                <UserIcon />
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn-secondary text-sm py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="font-medium text-secondary hover:text-primary transition-colors">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          className="md:hidden bg-white border-t border-gray-200 px-4 py-4"
        >
          <ul className="flex flex-col gap-4" role="list">
            {navLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
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
              {user ? (
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 font-medium transition-colors hover:text-primary text-secondary px-2 py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserIcon />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    className="w-full text-left font-medium transition-colors hover:text-primary text-secondary px-2 py-1"
                    onClick={() => {
                      void signOut()
                      setMenuOpen(false)
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block font-medium transition-colors hover:text-primary text-secondary px-2 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
