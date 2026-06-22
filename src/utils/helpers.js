/**
 * UTILS — helpers.js
 * Pure utility functions used across controllers and views.
 */

/** Format a price number as ₹ string with locale commas */
export const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/** Get a star string from a numeric rating */
export const getStars = (r) => "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "");

/** Get today's date string in YYYY-MM-DD */
export const todayISO = () => new Date().toISOString().split("T")[0];

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

/** Debounce a function */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

/** Truncate text to n chars with ellipsis */
export const truncate = (str, n = 80) =>
  str.length > n ? str.slice(0, n).trimEnd() + "…" : str;

/** Format an ISO date string for display */
export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
