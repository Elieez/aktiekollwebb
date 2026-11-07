export interface InsiderTrade {
  symbol: string | null;
  companyName: string;
  insiderName: string;
  position: string;
  transactionType: string;
  shares: number;
  price: number;
  /** ISO currency of `price` as reported to FI (usually SEK, sometimes EUR/USD/NOK…). */
  currency: string;
  /** shares × price converted to SEK by the backend. Null if no FX rate was available. */
  valueSek?: number | null;
  instrumentType?: string | null;
  /** Reported by a closely associated person/entity (FI "Närstående"). */
  isCloselyAssociated?: boolean | null;
  /** Linked to a share/incentive program (FI "Är kopplad till aktieprogram"). */
  isShareProgram?: boolean | null;
  publishingDate: string;
  transactionDate?: string;
}
