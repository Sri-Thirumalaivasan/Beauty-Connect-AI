/**
 * MODEL — ReviewModel.js
 * Defines Review entity shape and factory.
 */

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} salonId
 * @property {string} user
 * @property {number} rating  - 1–5
 * @property {string} text
 * @property {string} date
 */

/** @param {Partial<Review>} raw @returns {Review} */
export function createReview(raw = {}) {
  return {
    id:      raw.id      || String(Math.random()),
    salonId: raw.salonId || "",
    user:    raw.user    || "Anonymous",
    rating:  typeof raw.rating === "number" ? Math.min(5, Math.max(1, raw.rating)) : 5,
    text:    raw.text    || "",
    date:    raw.date    || new Date().toISOString().split("T")[0],
  };
}
