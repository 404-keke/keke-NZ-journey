export interface WorkLog {
  id: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  days: number;      // Actual days added
  note: string;
  timestamp: number; // Creation time
}

// Legacy support for migration if needed, though we will cast types in runtime
export interface LegacyWorkLog {
  id: string;
  date: string; 
  days: number;
  note: string;
  timestamp: number;
}

export interface DateDiff {
  days: number;
  isFuture: boolean;
}