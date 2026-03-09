'use client'

import { useState } from 'react'

const subjectOptions = [
  'General Inquiry',
  'Course Enrollment',
  'JLPT Preparation',
  'Business Japanese',
  'Private Tutoring',
  'Pricing & Plans',
  'Other',
]

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const contactInfo = [
  {
    section: 'Bangladesh Office',
    items: [
      { icon: '📍', label: 'Address', value: 'House-298, Shadinota Sharoni Road, Jamtula Mur, Uttar Badda, Dhaka-1212' },
      { icon: '📞', label: 'Mobile', value: '01601687773', href: 'tel:+8801601687773' },
      { icon: '📞', label: 'Mobile', value: '01967016700', href: 'tel:+8801967016700' },
    ],
  },
  {
    section: 'Japan Office',
    items: [
      { icon: '📍', label: 'Address', value: 'Tokyo to Kita ku Akabane Nishi 4-35-5 Sakauekup101' },
      { icon: '📞', label: 'Mobile', value: '+81 70-9039-4475', href: 'tel:+817090394475' },
    ],
  },
  {
    section: 'Email',
    items: [
      { icon: '📧', label: 'Email', value: 'miahsuzan818@gmail.com', href: 'mailto:miahsuzan818@gmail.com' },
    ],
  },
]

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required.'
  if (!data.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!data.subject) errors.subject = 'Please select a subject.'
  if (!data.message.trim()) {
    errors.message = 'Message is required.'
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  }
  return errors
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setServerMessage(data.message)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setServerMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setServerMessage('Unable to send message. Please try again later.')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl">
            Contact Us
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Have a question or ready to enroll? We&apos;d love to hear from you. Fill out the
            form and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <aside aria-label="Contact information">
              <h2 className="text-2xl font-bold text-secondary mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((group) => (
                  <div key={group.section} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mb-3">{group.section}</p>
                    <div className="space-y-3">
                      {group.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-xl mt-0.5" aria-hidden="true">{item.icon}</span>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                              {item.label}
                            </p>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="text-secondary hover:text-primary transition-colors font-medium text-sm"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-secondary font-medium text-sm">{item.value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-secondary mb-6">Send Us a Message</h2>

              {status === 'success' ? (
                <div
                  role="alert"
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <p className="text-4xl mb-4" aria-hidden="true">✅</p>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">{serverMessage}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 btn-primary text-sm py-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                  className="space-y-6"
                >
                  {status === 'error' && (
                    <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                      {serverMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-secondary mb-1.5">
                        Full Name <span className="text-primary" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        aria-invalid={!!errors.name}
                        className={`w-full px-4 py-3 rounded-xl border text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                          errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Taro Yamada"
                      />
                      {errors.name && (
                        <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-1.5">
                        Email Address <span className="text-primary" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        aria-invalid={!!errors.email}
                        className={`w-full px-4 py-3 rounded-xl border text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                          errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="taro@example.com"
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-secondary mb-1.5">
                        Phone <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="+81 00-0000-0000"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-secondary mb-1.5">
                        Subject <span className="text-primary" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        aria-invalid={!!errors.subject}
                        className={`w-full px-4 py-3 rounded-xl border text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                          errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      >
                        <option value="">Select a subject…</option>
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p id="subject-error" role="alert" className="mt-1.5 text-xs text-red-600">
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-secondary mb-1.5">
                      Message <span className="text-primary" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      aria-invalid={!!errors.message}
                      className={`w-full px-4 py-3 rounded-xl border text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y ${
                        errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Tell us about your learning goals, current level, or any questions you have…"
                    />
                    {errors.message && (
                      <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
