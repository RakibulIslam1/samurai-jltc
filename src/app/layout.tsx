import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://samurai-jltc.com'),
  title: {
    default: 'Samurai JLTC – Japanese Language Training Center',
    template: '%s | Samurai JLTC',
  },
  description:
    'Samurai JLTC offers expert Japanese language training for all levels. Enroll today and master Japanese with our experienced instructors.',
  keywords: ['Japanese language', 'JLTC', 'language training', 'Japanese courses', 'learn Japanese'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://samurai-jltc.com',
    siteName: 'Samurai JLTC',
    title: 'Samurai JLTC – Japanese Language Training Center',
    description:
      'Expert Japanese language training for all levels. Enroll today and master Japanese.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Samurai JLTC – Japanese Language Training Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samurai JLTC – Japanese Language Training Center',
    description: 'Expert Japanese language training for all levels.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn-primary"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
