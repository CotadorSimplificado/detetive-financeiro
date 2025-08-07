import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Utility functions for date manipulation using date-fns v3 with pt-BR locale
 */

/**
 * Get the start and end dates of a given month
 */
export function getMonthRange(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    startDate: start,
    endDate: end
  };
}

/**
 * Format date to Brazilian Portuguese
 */
export function formatDateBR(date: Date, pattern: string = "dd/MM/yyyy") {
  return format(date, pattern, { locale: ptBR });
}

/**
 * Format month and year for display
 */
export function formatMonthYear(date: Date) {
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
}

/**
 * Format month name only
 */
export function formatMonth(date: Date) {
  return format(date, "MMMM", { locale: ptBR });
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * Check if date is current month
 */
export function isCurrentMonth(date: Date) {
  return isSameMonth(date, new Date());
}