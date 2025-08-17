# AktieKollWebb

AktieKollWebb is a web application for tracking insider trades and significant transactions ("big trades") in publicly traded companies. Built with [Next.js](https://nextjs.org), it provides users with visualizations and detailed lists of recent company insider activities, making it easier to analyze market movements influenced by company insiders.

## Features

- **Insider Trades List:** Browse recent insider transactions with key details like company, insider name, transaction type, value, and date.
- **Top 10 Big Trades:** See a ranked list of the highest-value insider transactions.
- **Stock Charts:** Visualize recent price trends for individual stocks.
- **Search:** Quickly look up companies and view their insider trade history.
- **Buy/Sell Statistics:** View aggregated buy and sell transaction counts for each company.

## Getting Started

First, install dependencies, then run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
# or
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You can start editing the main page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `src/app/` — Next.js pages and API routes
- `src/components/` — UI components (Trade lists, Charts, Search bar, etc.)
- `src/lib/api/` — API utility functions for fetching insider trade data
- `src/app/globals.css` — Tailwind-based global styles

## Deployment

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For more info, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

---

> **Note:** This project is private and meant for educational or internal use.
