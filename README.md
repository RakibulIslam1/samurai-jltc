# Samurai JLTC — Japanese Language Training Center

A modern, production-ready website for **Samurai Japanese Language Training Center**, built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Firebase** (Auth + Firestore).

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | React framework (App Router, SSR, API routes) |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling (deep maroon theme) |
| Firebase (Client SDK) | Authentication |
| Firebase Admin SDK | Server-side auth verification + Firestore |
| Firestore | Contact messages & admin role storage |

---

## Getting Started

### Prerequisites

- Node.js **18.17+** (LTS recommended)
- npm **9+**
- Firebase project with Firestore and Authentication enabled

### Installation

```bash
git clone https://github.com/RakibulIslam1/samurai-jltc.git
cd samurai-jltc
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase configuration (see [Firebase + Env Vars](#firebase--env-vars) below).

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
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (Header, Footer, metadata)
│   │   ├── globals.css                   # Tailwind base + custom component classes
│   │   ├── page.tsx                      # Home page
│   │   ├── about/page.tsx                # About Us page
│   │   ├── japan-student-visa/page.tsx   # Japan Student Visa page
│   │   ├── ssw-visa/page.tsx             # SSW Visa page
│   │   ├── working-visa/page.tsx         # Working Visa page
│   │   ├── malaysia-student-visa/page.tsx # Malaysia Student Visa page
│   │   ├── air-ticket-service/page.tsx   # Air Ticket Service page
│   │   ├── contact/page.tsx              # Contact form page (client component)
│   │   ├── login/page.tsx                # Admin login page
│   │   ├── admin/page.tsx                # Admin dashboard (messages + role management)
│   │   ├── services/page.tsx             # Courses & pricing page
│   │   ├── not-found.tsx                 # 404 page
│   │   ├── sitemap.ts                    # Auto-generated sitemap.xml
│   │   ├── robots.ts                     # Auto-generated robots.txt
│   │   └── api/
│   │       ├── contact/route.ts          # POST /api/contact — saves to Firestore
│   │       └── admin/
│   │           ├── messages/route.ts     # GET /api/admin/messages (admin auth)
│   │           ├── messages/[id]/route.ts # PATCH /api/admin/messages/:id
│   │           └── roles/route.ts        # GET/POST /api/admin/roles (super admin)
│   ├── components/
│   │   ├── Header.tsx                    # Sticky responsive navigation
│   │   └── Footer.tsx                    # Footer with contact info
│   └── lib/
│       ├── firebase-client.ts            # Firebase client SDK (auth, firestore)
│       ├── firebase-admin.ts             # Firebase Admin SDK (server-side)
│       └── auth-helpers.ts               # Auth/authz helpers for API routes
├── .env.local.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services, why Japan, courses, qualifications |
| `/about` | About — school overview, services, mission, values |
| `/japan-student-visa` | Japan Student Visa — overview, requirements, process |
| `/ssw-visa` | SSW Visa — sectors, process |
| `/working-visa` | Working Visa — categories, process |
| `/malaysia-student-visa` | Malaysia Student Visa — benefits, process |
| `/air-ticket-service` | Air Ticket Service — features, popular routes |
| `/contact` | Contact form — two offices, stores submissions in Firestore |
| `/login` | Admin login (Firebase Auth) |
| `/admin` | Admin dashboard — view messages, update status, manage roles |

---

## Firebase + Env Vars

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password sign-in method
3. Enable **Firestore Database** in production mode
4. Create a service account: **Project Settings → Service Accounts → Generate new private key**

### Firestore Security Rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public: write-only contact messages
    match /contactMessages/{id} {
      allow create: if true;
      allow read, update, delete: if false; // enforced server-side only
    }
    // Admin settings: no direct client access
    match /adminSettings/{doc} {
      allow read, write: if false;
    }
  }
}
```

### Bootstrap Super Admin

After deploying, create the `adminSettings/roles` document in Firestore:

```json
{
  "superAdmins": ["rakibul.rir06@gmail.com"],
  "admins": []
}
```

### Client-Side Environment Variables (public — safe to expose)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Server-Side Environment Variables (keep secret)

```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

## Admin Panel

- **Login** at `/login` with a Firebase Auth email/password account.
- **Dashboard** at `/admin`:
  - View all contact form submissions
  - Update message status: `new` → `read` → `responded`
  - **Super admins** can add/remove admins and promote/demote super admins
  - Cannot remove the last super admin

### Role Storage (Firestore)

`adminSettings/roles`:
```json
{
  "superAdmins": ["rakibul.rir06@gmail.com"],
  "admins": ["another@example.com"]
}
```

All admin API routes validate Firebase ID tokens server-side via the Firebase Admin SDK.

---

## Deployment (Vercel)

### Steps

1. Push the repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no build configuration needed.
4. In the Vercel project dashboard, go to **Settings → Environment Variables** and add all required env vars:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase project ID (server) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account private key (with `\n` for newlines) |

5. Click **Deploy**.

### Notes

- The `FIREBASE_ADMIN_PRIVATE_KEY` must have literal `\n` characters (not actual newlines) in Vercel env vars. The code handles the conversion automatically.
- For the contact form to persist messages, Firestore must be enabled and the Admin SDK env vars must be set. Without them, the form still works but messages are not stored.

---

## Static Assets (add your own)

| File | Size | Purpose |
|---|---|---|
| `public/og-image.png` | 1200×630 px | Open Graph / social share image |
| `public/favicon.ico` | 32×32 px | Browser tab icon |
| `public/apple-touch-icon.png` | 180×180 px | iOS home screen icon |

---

## License

MIT © Samurai Japanese Language Training Center


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
