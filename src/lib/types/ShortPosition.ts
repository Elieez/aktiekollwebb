export type ShortSort = "highest" | "increase" | "decrease";

export interface ShortListItem {
  issuerName: string;
  lei: string;
  symbol: string | null;
  positionPercent: number;
  latestPositionDate: string | null;
  change: number | null;
  changeSince: string | null;
  holderCount: number;
  insiderBuys90d: number;
  insiderSells90d: number;
}

export interface ShortTopList {
  updatedAt: string | null;
  items: ShortListItem[];
}

export interface ShortHolder {
  holderName: string;
  positionPercent: number;
  positionDate: string;
}

export interface SeriesPoint {
  date: string;
  value: number;
}

export interface ShortCompany {
  issuerName: string;
  lei: string;
  symbol: string | null;
  positionPercent: number;
  latestPositionDate: string | null;
  change: number | null;
  changeSince: string | null;
  holders: ShortHolder[];
  totalSeries: SeriesPoint[];
  significantSeries: SeriesPoint[];
}
