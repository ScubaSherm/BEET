import { addDays, differenceInCalendarDays, format, isValid, parseISO } from "date-fns";

export const todayIso = () => format(new Date(), "yyyy-MM-dd");

export function calculateNextDueDate(lastCheckedDate?: string, intervalDays?: number) {
  if (!lastCheckedDate || !intervalDays) return undefined;
  const date = parseISO(lastCheckedDate);
  if (!isValid(date)) return undefined;
  return format(addDays(date, intervalDays), "yyyy-MM-dd");
}

export function daysUntil(date?: string) {
  if (!date) return undefined;
  const parsed = parseISO(date);
  if (!isValid(parsed)) return undefined;
  return differenceInCalendarDays(parsed, new Date());
}

export function dueStatus(date: string | undefined, soonDays: number) {
  const days = daysUntil(date);
  if (days === undefined) return "Unscheduled";
  if (days < 0) return "Overdue";
  if (days <= soonDays) return "Due Soon";
  return "Scheduled";
}

export function expirationStatus(date: string | undefined, soonDays: number) {
  const days = daysUntil(date);
  if (days === undefined) return "No Expiration";
  if (days < 0) return "Expired";
  if (days <= soonDays) return "Expiring Soon";
  return "Valid";
}
