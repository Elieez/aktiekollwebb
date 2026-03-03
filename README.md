# AktieKollWebb

AktieKollWebb is a web application for tracking insider trades and significant transactions ("big trades") in publicly traded companies. Built with [Next.js](https://nextjs.org), it provides users with visualizations and detailed lists of recent company insider activities, making it easier to analyze market movements influenced by company insiders.

## Features

- **Insider Trades List:** Browse recent insider transactions with key details like company, insider name, transaction type, value, and date.
- **Top 10 Big Trades:** See a ranked list of the highest-value insider transactions.
- **Stock Charts:** Visualize recent price trends for individual stocks.
- **Search:** Quickly look up companies and view their insider trade history.
- **Buy/Sell Statistics:** View aggregated buy and sell transaction counts for each company.

## Project Structure

- `src/app/` — Next.js pages and API routes
- `src/components/` — UI components (Trade lists, Charts, Search bar, etc.)
- `src/lib/api/` — API utility functions for fetching insider trade data
- `src/app/globals.css` — Tailwind-based global styles
