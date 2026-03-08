import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center">
      <p className="text-8xl mb-6 select-none" aria-hidden="true">⛩</p>
      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <p className="text-2xl font-bold text-secondary mb-4">Page Not Found</p>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        この道は存在しません。 The path you&apos;re looking for doesn&apos;t exist. Let&apos;s
        guide you back to familiar ground.
      </p>
      <Link href="/" className="btn-primary">
        Return Home
      </Link>
    </section>
  )
}
