# 🏀 CourtSide — NBA Game Day Fan Hub

A modern NBA Game Day companion built with Next.js 14, featuring live scores, game breakdowns, key matchups, player stats, and standings — with full light/dark mode support.

---

## 🔗 Quick Links

| | |
|---|---|
| **GitHub Repository** | [github.com/alexg1299/nba-fan-hub](https://github.com/alexg1299/nba-fan-hub) |
| **Live Demo** | [courtside.vercel.app](https://courtside-jade.vercel.app/) |

---

## 📸 Features

- **Homepage** — Live scores, recent & upcoming games with filter tabs (All / Live / Today / Final)
- **Game Detail Page** — Scoreboard hero, key matchups, quarter-by-quarter scores, player stats, team stat comparisons
- **Standings Page** — Conference tables with playoff cutline indicators
- **Player Search** — Real-time player lookup via BallDontLie API
- **Light & Dark Mode** — Full theme toggle persisted across sessions
- **Graceful Fallback** — Mock data used transparently when API is unavailable or rate-limited
- **Responsive** — Mobile-first design, works on all screen sizes

---

## 🏗️ Architecture

```
Next.js 14 (App Router)
├── app/
│   ├── page.tsx                  ← Homepage (client component)
│   ├── standings/page.tsx        ← Standings page
│   ├── players/page.tsx          ← Player search
│   ├── game/[id]/page.tsx        ← Game detail
│   └── api/
│       ├── games/route.ts        ← GET /api/games     → normalized game list
│       ├── game/[id]/route.ts    ← GET /api/game/:id  → game + player stats
│       ├── standings/route.ts    ← GET /api/standings → conference standings
│       ├── teams/route.ts        ← GET /api/teams     → all NBA teams
│       └── players/route.ts     ← GET /api/players?q= → player search
├── components/
│   ├── Navbar.tsx                ← Sticky header with theme toggle
│   ├── GameCard.tsx              ← Game preview card
│   ├── PlayerCard.tsx            ← Player stat card
│   ├── StatBar.tsx               ← Team comparison stat bar
│   ├── StandingsTable.tsx        ← Conference standings table
│   ├── Skeleton.tsx              ← Loading states
│   └── ThemeProvider.tsx         ← next-themes wrapper
├── lib/
│   ├── nba-api.ts                ← BallDontLie API client + helpers
│   └── mock-data.ts              ← Fallback data for rate limiting
└── types/
    └── nba.ts                    ← TypeScript interfaces
```

### Backend Design

All external API calls happen **server-side only** in Next.js Route Handlers (`app/api/`). This means:
- The BallDontLie API key is never exposed to the browser
- Data is normalized before being sent to the client (snake_case → camelCase, status normalization, etc.)
- ISR (`revalidate`) is used per-route: games revalidate every 60s, teams every 24h
- Each route falls back to mock data on error — the client always gets a valid response

### API Used

**BallDontLie** (free tier, no key required for basic endpoints — key adds more features):
- `GET /v1/games` — schedule and scores
- `GET /v1/games/:id` — single game
- `GET /v1/stats` — box score stats by game
- `GET /v1/players` — player search
- `GET /v1/season_averages` — season stats

Rate limit: ~5 req/min on free tier. The app handles this gracefully.

> **Note on `nba_api` Python package**: The Python `nba_api` package was considered but not used because:
> 1. It requires a Python backend (FastAPI/Flask) rather than pure Next.js
> 2. It scrapes `stats.nba.com` which has aggressive rate limiting and no public API key
> 3. BallDontLie provides the same data with a clean REST API and free tier — perfect for this use case
> 
> If Python backend was preferred, `nba_api` via FastAPI would be the approach — the Next.js frontend would call `http://your-fastapi-service/games` instead.

---

## 🚀 Full Setup Guide

### Prerequisites

- Node.js 18.17+ ([download](https://nodejs.org))
- npm 9+ (included with Node)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nba-fan-hub.git
cd nba-fan-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your BallDontLie API key:

```env
BALLDONTLIE_API_KEY=your_key_here
```

**Getting a free API key:**
1. Visit [app.balldontlie.io](https://app.balldontlie.io)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Paste it into `.env.local`

> **The app works without an API key** — it will fall back to realistic mock data. This is clearly indicated in the UI with a "Demo data" badge.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production (optional, test locally)

```bash
npm run build
npm start
```

---

## 🌐 Deployment to Vercel

### Option A: Vercel CLI (recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```
   Follow the prompts. Vercel auto-detects Next.js.

4. Add your API key as an environment variable:
   ```bash
   vercel env add BALLDONTLIE_API_KEY
   ```
   Enter your key when prompted. Then redeploy:
   ```bash
   vercel --prod
   ```

### Option B: Vercel Dashboard (GitHub integration)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/nba-fan-hub.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → "New Project"

3. Import your GitHub repository

4. In "Environment Variables", add:
   - Name: `BALLDONTLIE_API_KEY`
   - Value: your API key

5. Click **Deploy**

Vercel will automatically redeploy on every `git push` to main.

---

## ⚖️ Tradeoffs & Notes

| Decision | Rationale |
|---|---|
| **Next.js App Router** | Server Components + Route Handlers = backend + frontend in one repo, no separate Express server needed |
| **BallDontLie free tier** | Clean REST API, no key needed for read-only, well-documented. Downside: rate limits, no standings endpoint |
| **Mock data fallback** | Users always see a working UI; rate limits don't break the experience |
| **CSS variables over Tailwind tokens** | Enables smooth light/dark transitions without class flicker; Tailwind still used for layout |
| **ISR over SSR** | Games revalidate every 60s via ISR instead of per-request SSR — reduces API call rate and improves performance |
| **No database** | Pure API integration as specified — no persistence layer needed |
| **No auth** | Out of scope per spec; the API key stays server-side via env vars |

### Limitations

- **Standings**: BallDontLie free tier doesn't have a standings endpoint — uses representative mock data
- **Live game updates**: Data refreshes only on page load / manual refresh (no WebSockets)
- **Player headshots**: NBA CDN URLs for player images require authentication; using initials instead
- **Historical data**: API returns current season; older seasons need explicit `season` parameter
- **Rate limits**: Free tier allows ~5 req/min — bursting beyond this falls back to mock data automatically

---

## 🛠️ AI Tools Used

This project used **Claude (Anthropic)** as an active development partner throughout the build. Specific uses:

| Area | How AI Was Used |
|---|---|
| **Project scaffolding** | Prompted Claude to generate the initial Next.js App Router folder structure, naming conventions, and the breakdown of which files should be Server vs. Client Components |
| **TypeScript interfaces** | Provided the BallDontLie API JSON response samples; Claude produced the `types/nba.ts` interfaces and the camelCase normalization helpers in `lib/nba-api.ts` |
| **Mock data** | Asked Claude to generate realistic mock game, standings, and player stat data that exactly mirrors the normalized API response shape — used as the fallback when the API is unavailable |
| **Debugging** | Pasted error output into Claude to diagnose ISR/`revalidate` config issues with the App Router and dynamic route conflicts |
| **Component boilerplate** | Used Claude to draft initial versions of repetitive UI components (`StatBar`, `StandingsTable`, `Skeleton`) which were then refined manually |

**What was done manually:**
- All architectural decisions (ISR vs SSR, CSS variable theming strategy, route handler design)
- UX/design choices, layout composition, and Tailwind class tuning
- Code review, integration testing, and fixing any AI-introduced bugs
- Writing this README

All AI-generated code was reviewed and adjusted before use. AI was treated as a pair-programmer, not an autonomous agent.

---

## 📁 Project Structure Summary

```
nba-fan-hub/
├── app/                 # Next.js App Router
│   ├── api/             # Backend route handlers (server-only)
│   ├── game/[id]/       # Dynamic game detail page
│   ├── players/         # Player search page
│   ├── standings/       # Standings page
│   ├── globals.css      # Global styles + CSS variables
│   ├── layout.tsx       # Root layout with fonts + ThemeProvider
│   └── page.tsx         # Homepage
├── components/          # Reusable React components
├── lib/                 # API client + mock data
├── types/               # TypeScript interfaces
├── .env.local.example   # Environment variable template
├── vercel.json          # Vercel deployment config
└── README.md            # This file
```
