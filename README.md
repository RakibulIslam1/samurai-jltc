# Samurai JLTC — Japanese Language Training Center

A modern, production-ready website for **Samurai JLTC**, built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2.35 | React framework (App Router, SSR, API routes) |
| React | 18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4 | Utility-first styling |
| ESLint | ^8 | Linting |
| Prettier | ^3 | Code formatting |

---

## Getting Started

### Prerequisites

- Node.js **18.17+** (LTS recommended)
- npm **9+**

### Installation

```bash
git clone https://github.com/your-org/samurai-jltc.git
cd samurai-jltc
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building

```bash
npm run build
```

## Preview Production Build

```bash
npm run start
```

---

## Linting & Formatting

```bash
# Lint
npm run lint

# Format all files with Prettier
npm run format
```

---

## Project Structure

```
samurai-jltc/
├── public/
│   ├── favicon.svg          # Torii gate SVG icon
│   ├── favicon.ico          # (add your own)
│   ├── apple-touch-icon.png # (add your own)
│   └── og-image.png         # (add your own 1200×630 OG image)
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout (Header, Footer, metadata)
│   │   ├── globals.css      # Tailwind base + custom component classes
│   │   ├── page.tsx         # Home page
│   │   ├── not-found.tsx    # 404 page
│   │   ├── sitemap.ts       # Auto-generated sitemap.xml
│   │   ├── robots.ts        # Auto-generated robots.txt
│   │   ├── about/
│   │   │   └── page.tsx     # About page
│   │   ├── services/
│   │   │   └── page.tsx     # Courses & pricing page
│   │   ├── contact/
│   │   │   └── page.tsx     # Contact form page (client component)
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts # POST /api/contact handler
│   └── components/
│       ├── Header.tsx       # Sticky responsive navigation
│       └── Footer.tsx       # Footer with links and contact info
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
└── .prettierrc
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, features, CTA |
| `/about` | About — mission, team, values |
| `/services` | Courses (N5–N1, JLPT, Business, Conversation) + pricing |
| `/contact` | Contact form with client-side validation |
| `/api/contact` | API route (POST) — handles form submissions |

---

## Contact Form Integration

The `/api/contact` route currently logs submissions to the console. To send real emails in production, integrate an email service:

### Resend (recommended)

```bash
npm install resend
```

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'noreply@samurai-jltc.com',
  to: 'info@samurai-jltc.com',
  subject: `New contact: ${subject}`,
  text: `From: ${name} <${email}>\n\n${message}`,
})
```

### Environment Variables

Create a `.env.local` file (never commit this):

```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

---

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no configuration needed.
4. Add environment variables in the Vercel dashboard.
5. Deploy!

---

## Static Assets (add your own)

| File | Size | Purpose |
|---|---|---|
| `public/og-image.png` | 1200×630 px | Open Graph / social share image |
| `public/favicon.ico` | 32×32 px | Browser tab icon |
| `public/apple-touch-icon.png` | 180×180 px | iOS home screen icon |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

Please run `npm run lint` and `npm run format` before opening a PR.

---

## License

MIT © Samurai JLTC
