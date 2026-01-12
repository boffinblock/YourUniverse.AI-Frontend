/**
 * Utility functions for formatting dates
 */

/**
 * Formats a date string to a localized date format (DD/MM/YYYY)
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: "en-GB")
 * @returns Formatted date string (e.g., "12/03/2025")
 */
export function formatDate(
  dateString: string | Date,
  locale: string = "en-GB"
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formats a date string to a localized date and time format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: "en-GB")
 * @returns Formatted date and time string (e.g., "12/03/2025, 10:30:00")
 */
export function formatDateTime(
  dateString: string | Date,
  locale: string = "en-GB"
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Formats a date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const diff = (Date.now() - date.getTime()) / 1000; // Difference in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} ${Math.floor(diff / 60) === 1 ? "min" : "mins"} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${Math.floor(diff / 3600) === 1 ? "hour" : "hours"} ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ${Math.floor(diff / 86400) === 1 ? "day" : "days"} ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} ${Math.floor(diff / 604800) === 1 ? "week" : "weeks"} ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} ${Math.floor(diff / 2592000) === 1 ? "month" : "months"} ago`;
  
  return `${Math.floor(diff / 31536000)} ${Math.floor(diff / 31536000) === 1 ? "year" : "years"} ago`;
}

/**
 * Formats a date to a short format (e.g., "12 Mar 2025")
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: "en-GB")
 * @returns Short formatted date string
 */
export function formatShortDate(
  dateString: string | Date,
  locale: string = "en-GB"
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date to a long format (e.g., "12 March 2025")
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: "en-GB")
 * @returns Long formatted date string
 */
export function formatLongDate(
  dateString: string | Date,
  locale: string = "en-GB"
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

