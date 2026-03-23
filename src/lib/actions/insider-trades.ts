"use server";
// Server actions for client-initiated data fetching.
// "use server" ensures these run on the server, so:
//   - NEXT_PUBLIC_API_URL resolves correctly even if the backend is not reachable from the browser
//   - next: { revalidate } in the underlying get() utility is honoured (server-only fetch option)
// TradesList imports from here instead of @/lib/api/insider-trades directly.

import {
  getInsiderTrades,
  getInsiderTradesByCompanyName,
} from "@/lib/api/insider-trades";

export { getInsiderTrades, getInsiderTradesByCompanyName };
