# AktieKoll
**Swedish insider trading — tracked and presented in real time**

[🌐 Live Site](https://aktiekoll.com)

AktieKoll is a frontend web application built with **Next.js 16** that presents Swedish insider trading data collected and served by the AktieKoll backend. Instead of manually navigating Finansinspektionen's public register, users get a fast, clean interface with trade feeds, company charts, a follow system, and real-time notifications.

The backend API that powers this project lives at [elieez/aktiekoll](https://github.com/Elieez/aktiekoll).

---

## How It Works

The frontend is a purely headless client — it has no direct database access. All data flows through the REST API:

```
1. BACKEND CRON    →   2. REST API         →   3. ISR CACHE        →   4. USER
Every 6 hours,         .NET backend            Next.js caches          Near-real-time
FI data is fetched,    exposes enriched        responses at the        trade data in
resolved, and saved    insider trade data      edge (5 min–6 hrs)      the browser
```

1. **Data source** — The .NET backend runs a cron every 6 hours to sync Finansinspektionen's insider register, resolve tickers, and fire notifications. The frontend never touches that pipeline directly.
2. **API integration** — All data is fetched from the backend via typed API client functions in `src/lib/api/`. Each resource (trades, companies, auth, follows) has its own module.
3. **Caching** — Responses are cached using Next.js ISR (`next: { revalidate: N }`). Trade data revalidates every 5 minutes, company search every 24 hours, YTD stats every 6 hours.
4. **Auth** — JWT access tokens are stored in `localStorage` and attached to protected requests. Google OAuth and full email/password flows are handled end to end in the frontend.

---

## Features

**Trade data**
- Paginated feed of all insider trades — insider name, role, trade type, share count, price, total value, and date
- Top 10 largest trades from the previous trading day
- Buy/sell statistics — companies ranked by transaction count over a configurable period

**Company pages**
- 1-year stock price chart with buy/sell trade markers overlaid (powered by lightweight-charts)
- Donut chart showing the buy/sell ratio over the past 12 months
- Full trade history for the selected company

**Search**
- Debounced autocomplete company search by name or ticker
- Keyboard navigation (arrow keys + Enter), results cached server-side for 24 hours

**Authentication**
- Email/password login and registration
- Google OAuth — sign in with Google, auto-linked to existing accounts
- Email verification on registration, with resend support
- Password reset via emailed token
- GDPR-compliant two-step account deletion — request, confirm via email

**Follow system**
- Follow up to 3 companies to build a personal watchlist
- Receive alerts when new insider trades are registered for followed companies

**Notification preferences**
- Toggle email alerts on/off per account
- Discord webhook notifications — store a webhook URL, enable/disable independently

**Theme**
- Dark and light mode, toggled via the header
- Preference persisted in `localStorage`, applied without a flash of unstyled content

---

## Tech Stack

| Area | Tech |
| :--- | :--- |
| **Framework** | Next.js 16 / React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Charts** | lightweight-charts |
| **Market Data** | yahoo-finance2 |
| **Icons** | lucide-react |
| **DevOps** | Renovate Bot |

---

## Developer Setup

This project is the dedicated frontend for the AktieKoll backend. It can be run locally for technical review:

- **Prerequisites:** Node.js
- **Configuration:** Copy `.env.local` and set the required variables:
  - `NEXT_PUBLIC_API_URL` — base URL of the backend API
  - `NEXT_PUBLIC_SITE_URL` — public site URL (used for metadata, default: `https://aktiekoll.se`)
- **Run:** `npm run dev`

---

## Project Structure

Follows the **Next.js App Router** convention:

| Module | Purpose |
| :--- | :--- |
| `src/app/` | Pages, layouts, and internal API routes (App Router) |
| `src/components/` | Reusable UI components — charts, trade tables, search, auth forms |
| `src/lib/api/` | Typed API client functions for each backend resource |
| `src/lib/types/` | Shared TypeScript type definitions |

---

## Pages Overview

### Trades — `/trades`

| Route | Auth | Description |
| :--- | :--- | :--- |
| `/trades` | — | Main feed — paginated trade list, top 10 biggest trades, and buy/sell statistics |

### Companies — `/stocks`

| Route | Auth | Description |
| :--- | :--- | :--- |
| `/stocks/[symbol]` | — | Company detail page — 1-year price chart with trade markers, buy/sell pie chart, full trade history |

### Watchlist — `/bevakningslista`

| Route | Auth | Description |
| :--- | :--- | :--- |
| `/bevakningslista` | JWT | List of followed companies, with unfollow controls |

### Settings — `/installningar`

| Route | Auth | Description |
| :--- | :--- | :--- |
| `/installningar` | JWT | Notification preferences (email, Discord webhook), account deletion |

### Authentication — `/auth`

| Route | Auth | Description |
| :--- | :--- | :--- |
| `/auth` | — | Login and registration forms, Google OAuth |
| `/auth/callback` | — | Google OAuth redirect handler |
| `/auth/verify-email` | — | Email address verification via link from inbox |
| `/auth/forgot-password` | — | Request a password reset email |
| `/auth/reset-password` | — | Set a new password using the emailed token |
| `/auth/delete-confirm` | — | Confirm account deletion via emailed link |

### Informational

| Route | Auth | Description |
| :--- | :--- | :--- |
| `/om` | — | About page — what insider trading is and why it matters |
| `/anvandarvillkor` | — | Terms of service |
| `/integritetspolicy` | — | Privacy policy |

---

## Automation

**Renovate Bot** automatically keeps npm packages up to date to minimize security exposure.

---

## Purpose

Built to deepen knowledge of Next.js and TypeScript in the context of a full-stack financial data application. The focus has been on clean architecture, type safety, and a polished UI — consuming a production-grade .NET API to deliver a fast, responsive experience.

The backend for this project lives at [elieez/aktiekoll](https://github.com/Elieez/aktiekoll).
