export interface InsiderTrade {
  symbol: string | null;
  companyName: string;
  insiderName: string;
  position: string;
  transactionType: string;
  shares: number;
  price: number;
  publishingDate: string;
}
