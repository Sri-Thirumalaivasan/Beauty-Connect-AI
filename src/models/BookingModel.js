/**
 * MODEL — BookingModel.js
 * Defines Booking entity shape and factory.
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} salonId
 * @property {string} salonName
 * @property {string} salonArea
 * @property {string} serviceId
 * @property {string} serviceName
 * @property {number} servicePrice
 * @property {string} date        - ISO date string "YYYY-MM-DD"
 * @property {string} slot        - "10:00 AM"
 * @property {string} userId
 * @property {string} userName
 * @property {string} userEmail
 * @property {string} status      - "confirmed" | "cancelled" | "completed"
 * @property {string} createdAt
 */

/**
 * @param {Partial<Booking>} raw
 * @returns {Booking}
 */
export function createBooking(raw = {}) {
  return {
    id:           raw.id           || `bk_${Date.now()}`,
    salonId:      raw.salonId      || "",
    salonName:    raw.salonName    || "",
    salonArea:    raw.salonArea    || "",
    serviceId:    raw.serviceId    || "",
    serviceName:  raw.serviceName  || "",
    servicePrice: typeof raw.servicePrice === "number" ? raw.servicePrice : 0,
    date:         raw.date         || "",
    slot:         raw.slot         || "",
    userId:       raw.userId       || "",
    userName:     raw.userName     || "",
    userEmail:    raw.userEmail    || "",
    status:       raw.status       || "confirmed",
    createdAt:    raw.createdAt    || new Date().toISOString(),
  };
}

/** @param {Booking} b @returns {string} */
export function getBookingDisplayDate(b) {
  if (!b.date) return "—";
  return new Date(b.date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}
