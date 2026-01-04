import { DateDiff } from './types';

// Constants
export const NZ_ENTRY_DATE = '2025-03-19';
export const WORK_START_DATE = '2025-12-19'; 
export const ONE_YEAR_HALF_DAYS = Math.round(365 * 1.5); // Approx 548 days

export const calculateDaysDifference = (targetDateStr: string): DateDiff => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - target.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: Math.abs(diffDays),
    isFuture: diffDays < 0
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// Formats a range nicely: "2025年12月1日" or "2025年12月1日 — 5日"
export const formatDateRange = (startStr: string, endStr: string): string => {
  const start = new Date(startStr);
  const end = new Date(endStr);

  if (start.getTime() === end.getTime()) {
    return formatDate(startStr);
  }

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const startMonth = start.getMonth() + 1;
  const endMonth = end.getMonth() + 1;

  // Different Years
  if (startYear !== endYear) {
    return `${formatDate(startStr)} — ${formatDate(endStr)}`;
  }

  // Same Year, Different Month
  if (startMonth !== endMonth) {
    return `${startYear}年${startMonth}月${start.getDate()}日 — ${endMonth}月${end.getDate()}日`;
  }

  // Same Month
  return `${startYear}年${startMonth}月${start.getDate()}日 — ${end.getDate()}日`;
};

export const getDaysDiff = (startStr: string, endStr: string): number => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  // Add 1 to include the start day
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
};

export const getCycleDates = (): { start: Date, end: Date } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  const dec19Current = new Date(currentYear, 11, 19);
  
  let start: Date;
  let end: Date;

  if (now >= dec19Current) {
    start = dec19Current;
    end = new Date(currentYear + 1, 11, 19);
  } else {
    start = new Date(currentYear - 1, 11, 19);
    end = dec19Current;
  }
  
  return { start, end };
};