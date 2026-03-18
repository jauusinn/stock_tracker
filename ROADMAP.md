# Stocks Tracker — Project Roadmap

> **Status:** Requirements Finalized — Structured for Daily Token Budget
> **Created:** 2026-03-18
> **Stack:** Next.js 14 (App Router) · Tailwind CSS · TypeScript (Strict) · Zustand · Shadcn/UI · Lucide Icons

---

## Token Budget Strategy

This project is split into **6 independent sessions** (sprints). Each session is designed to:
- Be completable within **one daily Pro tier conversation**
- Produce a **working, testable state** at the end
- Require **minimal context carry-over** (just reference this ROADMAP + the existing code)

> **How to use:** Start a new conversation per sprint. Paste the sprint heading + checklist as your prompt. Antigravity only needs to read the files created in prior sprints — never the full history.

---

## Architecture Principles (SOLID)

| Principle | Implementation |
|-----------|---------------|
| **Single Responsibility** | `useStockData` hook fetches data; components render only |
| **Open-Closed** | Indicator system is extensible without modifying existing code |
| **Dependency Inversion** | `IStockProvider` interface abstracts the API; swap providers without touching UI |

---

## Sprint 1 — Scaffold & Config *(~15 min session)*

**Goal:** Empty Next.js app with all tooling configured, runnable with `npm run dev`.

- [ ] `npx create-next-app` with App Router, TypeScript, Tailwind, ESLint
- [ ] Install deps: `zustand`, `lucide-react`
- [ ] Init Shadcn/UI (`npx shadcn-ui@latest init`)
- [ ] Create folder structure (empty dirs with barrel exports):
  ```
  src/
  ├── components/{dashboard,search,ui}/
  ├── hooks/
  ├── providers/
  ├── stores/
  ├── types/
  ├── utils/
  └── lib/
  ```
- [ ] Add `.env.local.example` with `NEXT_PUBLIC_FINNHUB_API_KEY=`
- [ ] Verify: `npm run dev` → see default page
- [ ] Verify: `npm run build` → no errors

**Output:** Runnable shell project. No business logic yet.

---

## Sprint 2 — Types, Provider & Data Layer *(~20 min session)*

**Goal:** `FinnhubProvider` fully implemented and testable in isolation.

**Context needed:** Read `src/types/`, `src/providers/`, `src/utils/` (all empty from Sprint 1).

- [ ] Define interfaces in `types/stock.ts`: `Quote`, `CompanyProfile`, `StockCandle`, `StockData`
- [ ] Define `IStockProvider` interface in `providers/index.ts`
- [ ] Implement `FinnhubProvider` class in `providers/finnhub-provider.ts`
  - `getQuote(symbol)`, `getProfile(symbol)`, `getCandles(symbol, from, to)`
- [ ] Build rate-limiter utility in `utils/rate-limiter.ts`
  - Token bucket or sliding window (60 req/min)
  - Auto-retry with exponential backoff
- [ ] Create `useStockData` hook in `hooks/use-stock-data.ts`
- [ ] Verify: Create a temp test page at `app/test/page.tsx` that calls the provider for "AAPL" and logs the result

**Output:** Working data layer. UI-independent.

---

## Sprint 3 — Zustand Stores & Watchlist *(~15 min session)*

**Goal:** State management + localStorage persistence for watchlist.

**Context needed:** Read `src/types/stock.ts`, `src/hooks/use-stock-data.ts`.

- [ ] Create `stores/watchlist-store.ts`
  - `symbols: string[]`, `addSymbol()`, `removeSymbol()`
  - Persist to localStorage via Zustand middleware
- [ ] Create `stores/theme-store.ts`
  - `isDark: boolean`, `toggle()`
  - Apply `dark` class to `<html>`
- [ ] Create `hooks/use-watchlist.ts` — thin wrapper over store
- [ ] Verify: Browser console — add/remove symbols, refresh page, confirm persistence

**Output:** State layer complete. Still no visible UI beyond test page.

---

## Sprint 4 — Dashboard UI *(~25 min session)*

**Goal:** Fully styled dashboard with Stock Cards, search bar, dark mode toggle.

**Context needed:** Read `src/types/`, `src/hooks/`, `src/stores/`.

- [ ] Add Shadcn components: `Card`, `Input`, `Button`, `Badge`, `Skeleton`
- [ ] Build `components/dashboard/stock-card.tsx`
  - Ticker, Price, Daily % Change (green/red), RS Score badge, mini-sparkline placeholder
- [ ] Build `components/dashboard/dashboard.tsx`
  - Responsive grid of Stock Cards, loading skeletons, empty state
- [ ] Build `components/search/search-bar.tsx`
  - Debounced input, Finnhub symbol lookup, add-to-watchlist action
- [ ] Build `components/theme-toggle.tsx` — dark mode button
- [ ] Wire up `app/page.tsx` — layout with search + dashboard + theme toggle
- [ ] Verify: `npm run dev` → add tickers via search → see cards with live data

**Output:** Functional app. Looks good, shows real data, but no RS Score or sparklines yet.

---

## Sprint 5 — RS Score Engine & Sparklines *(~20 min session)*

**Goal:** IBD-style RS Score displayed on each card + intraday sparkline charts.

**Context needed:** Read `src/providers/finnhub-provider.ts`, `src/components/dashboard/stock-card.tsx`.

- [ ] Implement `utils/rs-score.ts`
  - Fetch 1-year candles for ticker + SPY
  - Calculate: `(Current - Price1YAgo) / Price1YAgo × 100`
  - Rank against SPY benchmark → percentile 1–99
- [ ] Create `hooks/use-rs-score.ts`
- [ ] Choose & install sparkline library (Recharts or react-sparklines)
- [ ] Add sparkline component to Stock Card
- [ ] Color-code RS Score badge (green ≥ 80, yellow 50–79, red < 50)
- [ ] Verify: Dashboard shows RS Score + sparkline for each ticker

**Output:** Feature-complete app.

---

## Sprint 6 — Polish, Error Handling & Deploy *(~20 min session)*

**Goal:** Production-ready with animations, error states, and deployment.

**Context needed:** Full `src/` directory.

- [ ] Add Framer Motion: card entry animations, hover effects
- [ ] Toast notifications for rate-limit hits
- [ ] Error boundaries and fallback UI
- [ ] Responsive audit (mobile, tablet, desktop)
- [ ] Accessibility pass (ARIA labels, keyboard nav, focus rings)
- [ ] `npm run build` — verify no errors or warnings
- [ ] Deploy to Vercel (or generate deploy instructions)
- [ ] Write `README.md` with setup + API key instructions

**Output:** Deployed, polished application.

---

## Confirmed Decisions

| # | Topic | Decision |
|---|-------|----------|
| 1 | API Provider | Finnhub.io (Free Tier) |
| 2 | State Management | Zustand |
| 3 | UI Components | Shadcn/UI + Lucide Icons |
| 4 | Auth | None (client-only) |
| 5 | Storage | localStorage for watchlist |

## Open Decisions (Team Discussion)

| # | Topic | Options | Decision |
|---|-------|---------|----------|
| 1 | Sparkline Library | Recharts / react-sparklines / custom SVG | TBD (Sprint 5) |
| 2 | Hosting | Vercel / Netlify | TBD (Sprint 6) |

---

*Start each sprint as a new conversation. Reference this file + existing code only. No prior conversation context needed.*
