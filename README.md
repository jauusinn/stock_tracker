# Decentralized Stocks Tracker

A modern, high-performance financial dashboard built to track real-time stock market data, calculate Relative Strength (RS) percentiles, and visualize historical price action. 

Designed with a strict **Bring Your Own Key (BYOK)** architecture, this application connects directly to the Finnhub API from your browser's local storage. Your data and credentials never touch a centralized server, ensuring complete privacy and decentralization.

## ✨ Key Features

- **Bring Your Own Key (BYOK)**: Securely paste your free Finnhub.io API token directly into the browser. Credentials are encrypted in local storage, eliminating `.env` backend requirements and telemetry.
- **IBD-Style Relative Strength (RS) Engine**: Evaluates a stock's 1-year performance against the `SPY` benchmark, generating a mathematically rigorous 1-99 Relative Strength score dynamically color-coded for instant trend analysis.
- **Live Search & Watchlist**: Lightning-fast debounced search across US exchanges. Add or remove tickers simply by clicking, managed entirely by persistent client-side Zustand state.
- **Sparkline Visualization**: Minimalist, real-time Recharts sparklines graphing 30-day historical closure trends directly on the dashboard cards.
- **Resilient Architecture**:
  - **Rate Limiting**: Built-in exponential backoff strictly adhering to Finnhub's 60-calls/minute free-tier limit, visualized elegantly via Sonner toast notifications.
  - **Error Boundaries**: Granular React Class Error Boundaries isolate network failures to individual UI cards without crashing the entire grid layout.
- **Fluid UI**: Fully responsive Tailwind CSS grid, featuring physics-based Framer Motion hover effects, staggered mounting layouts, and native Dark/Light mode toggling.

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (React 19) App Router
- **Styling:** Tailwind CSS + `clsx`/`tailwind-merge`
- **UI Components:** Shadcn/UI (Radix UI) + Lucide Icons
- **State Management:** Zustand (with LocalStorage persist middleware)
- **Animations:** Framer Motion
- **Charting:** Recharts
- **Data Provider:** Finnhub API v1

## 🚀 How to Use

### 1. Open the Web App
Navigate to the live application URL deployed on Vercel.

### 2. Activate the Dashboard
Upon your first visit, the Web App will automatically lock and prompt you for an API token. 
1. Click the **Register** link in the modal to fetch a completely free API token from [Finnhub.io](https://finnhub.io/).
2. Paste the 64-bit token into the secure password input.
3. The dashboard will instantly unlock and hydrate your saved watchlist!

*(You can update or revoke your API key at any time by clicking the Settings `<Gear />` icon in the top right navigation header).*

## 🚢 GitHub & Vercel Deployment

Because this architecture relies entirely on Client Components for data-fetching and decoupled local storage, it requires **zero environment variables** on the host server!

To deploy your own copy:
1. Fork or mirror this repository to your GitHub account.
2. Link the repository directly in your [Vercel Dashboard](https://vercel.com).
3. Vercel will automatically detect Next.js and deploy the production build seamlessly on every commit.

## 📜 License
MIT License. Feel free to fork, modify, and deploy for your own personal finance tracking.
