export interface InsiderTrade {
  Id: number;
  CompanyName: string;
  InsiderName: string;
  Position: string;
  TransactionType: string;
  Shares: number;
  Price: number;
  Date: Date;
}