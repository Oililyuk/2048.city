# 2048.city - Free 2048 Game

A modern, elegant 2048 puzzle game with iOS frosted glass effects, Google authentication, leaderboards, and social sharing.

## Features

- 🎮 Classic 2048 gameplay with liquid glass UI effects
- 🔐 Google OAuth authentication
- 🏆 Global and daily leaderboards
- 📧 Email notifications for new high scores (via Resend)
- 📱 Fully responsive design
- 🍪 GDPR-compliant cookie consent
- 💰 Ad-supported (Google AdSense ready)
- 🚀 Built with Next.js 14 & TypeScript

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v5 + Google OAuth
- **Database**: Vercel Postgres + Prisma ORM  
- **Email**: Resend (3000 free emails/month)
- **Styling**: CSS Modules (100% preserved from original)
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local`:

```env
# Database (from Vercel Postgres)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend Email
RESEND_API_KEY=  # Get from resend.com

# App Config
NEXT_PUBLIC_APP_URL=https://2048.city
```

### 3. Set up Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Email Service Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Free tier includes 3,000 emails/month
3. Verify your domain or use their sandbox domain for testing
4. Add API key to `.env.local`

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth endpoints
│   │   ├── scores/                 # Score management APIs
│   │   └── share/                  # Social sharing
│   ├── leaderboard/                # Leaderboard page
│   └── page.tsx                    # Main game page
├── components/
│   ├── Game/                       # Core game components
│   ├── Auth/                       # Authentication UI
│   ├── Leaderboard/                # Leaderboard components
│   └── CookieConsent/              # GDPR cookie banner
├── lib/
│   ├── db.ts                       # Database client
│   ├── auth.ts                     # Auth configuration
│   └── email.ts                    # Email utilities
└── prisma/
    └── schema.prisma               # Database schema
```

## License

MIT License - feel free to use for your own projects!
