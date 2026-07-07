# Stock News Summarizer

An AI-powered Indian stock news aggregator built for my grandfather. Pulls live news from 11 RSS feeds, summarizes it per company using LLaMA via Groq, assigns Bullish / Bearish / Neutral verdicts, and shows live NSE prices — all refreshed every hour.

## Features

- **AI Summaries** — per-company news summaries using Groq's LLaMA model with Bullish / Bearish / Neutral verdicts
- **7-day Verdict History** — visual trail of how sentiment has shifted over the past week
- **Live NSE Prices** — fetched from Yahoo Finance with day change and percentage
- **Daily Fundamentals** — ROCE, ROE, and 3yr Sales Growth scraped from Screener.in
- **11 RSS Sources** — ET Markets, Moneycontrol, LiveMint, Business Standard, Financial Express, Hindu BusinessLine
- **Hybrid Stock Search** — curated local database + live Yahoo Finance API so any NSE stock is findable
- **Batching Pipeline** — processes companies in batches of 8 to stay within Groq's free tier rate limits
- **Auto-backup & Restore** — watchlist is backed up on every change and restored automatically on server restart
- **Dark / Light Mode** — theme toggle with full CSS variable theming
- **Mobile Responsive** — works on phone and tablet

## Tech Stack

**Frontend**
- React + Vite
- Deployed on Vercel

**Backend**
- Node.js + Express
- SQLite via Node.js built-in (`node:sqlite`)
- Deployed on Render

**AI & Data**
- Groq API (LLaMA 3.1 8B Instant)
- Yahoo Finance API (stock prices + search)
- Screener.in (fundamentals scraping via Cheerio)
- RSS parsing via `rss-parser`

**Infrastructure**
- `node-cron` for hourly pipeline and daily fundamentals
- cron-job.org pinging `/api/health` every 14 minutes to keep Render free tier alive

## Project Structure

```
stock-news-app/
├── backend/
│   ├── db/
│   │   └── database.js          # SQLite setup and schema
│   ├── routes/
│   │   ├── watchlist.js         # Watchlist CRUD, export, backup/restore
│   │   └── companies.js         # NSE company search
│   ├── services/
│   │   ├── scheduler.js         # Pipeline orchestration and cron jobs
│   │   ├── rssFetcher.js        # RSS feed fetching and article filtering
│   │   ├── aiSummarizer.js      # Groq API summarization
│   │   ├── stockPrice.js        # Yahoo Finance price fetching
│   │   └── fundamentalsScraper.js # Screener.in fundamentals scraping
│   ├── data/
│   │   └── companies.js         # Curated NSE company list with aliases
│   └── index.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompanyCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Toolbar.jsx
│   │   │   ├── RefreshOverlay.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── CompanyAvatar.jsx
│   │   ├── App.jsx
│   │   ├── api.js               # Base URL helper for Vercel/Render
│   │   └── index.css
│   └── vite.config.js
└── start.bat                    # Local dev launcher
```

## Running Locally

**Prerequisites:** Node.js 22+, a Groq API key

**1. Clone the repo**
```bash
git clone https://github.com/Arjun-Nairr/Stock-Summarizer.git
cd Stock-Summarizer
```

**2. Set up the backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
GROQ_API_KEY=your_groq_api_key_here
```

**3. Set up the frontend**
```bash
cd ../frontend
npm install
```

**4. Run both servers**

Use `start.bat` from the root, or run manually:
```bash
# Terminal 1 — backend
cd backend && node index.js

# Terminal 2 — frontend
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3001`.

## Deployment

- **Backend** → Render (Web Service, root directory: `backend`)
- **Frontend** → Vercel (root directory: `frontend`)
- **Keep-alive** → cron-job.org pinging `/api/health` every 14 minutes

**Environment variables on Render:**
```
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_VERSION=22
```

**Environment variables on Vercel:**
```
VITE_API_URL=https://your-render-app.onrender.com
```

## Upcoming

- RAG pipeline for improved AI accuracy and reduced hallucination
