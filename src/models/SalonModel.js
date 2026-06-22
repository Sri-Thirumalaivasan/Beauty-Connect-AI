/**
 * MODEL — SalonModel.js
 * Defines the shape/schema of a Salon entity and
 * provides factory functions to create typed objects.
 * No UI, no side-effects — pure data representation.
 */

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} duration - in minutes
 */

/**
 * @typedef {Object} Salon
 * @property {string}   id
 * @property {string}   name
 * @property {string}   branch
 * @property {string}   area
 * @property {string}   address
 * @property {number}   rating
 * @property {number}   reviewCount
 * @property {string}   priceRange  - "₹" | "₹₹" | "₹₹₹"
 * @property {string[]} tags
 * @property {Service[]} services
 * @property {string}   hours
 * @property {string}   phone
 * @property {string}   image
 * @property {string}   about
 * @property {boolean}  openNow
 */

/**
 * Creates a validated Salon object from raw data.
 * Applies defaults for any missing optional fields.
 * @param {Partial<Salon>} raw
 * @returns {Salon}
 */
export function createSalon(raw = {}) {
  return {
    id:          raw.id          || "",
    name:        raw.name        || "Unknown Salon",
    branch:      raw.branch      || raw.area || "",
    area:        raw.area        || "",
    address:     raw.address     || "",
    rating:      typeof raw.rating === "number" ? raw.rating : 0,
    reviewCount: typeof raw.reviewCount === "number" ? raw.reviewCount : 0,
    priceRange:  raw.priceRange  || "₹₹",
    tags:        Array.isArray(raw.tags) ? raw.tags : [],
    services:    Array.isArray(raw.services) ? raw.services.map(createService) : [],
    hours:       raw.hours       || "10:00 AM – 8:00 PM",
    phone:       raw.phone       || "",
    image:       raw.image       || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85",
    about:       raw.about       || "",
    openNow:     Boolean(raw.openNow),
  };
}

/**
 * Creates a validated Service object.
 * @param {Partial<Service>} raw
 * @returns {Service}
 */
export function createService(raw = {}) {
  return {
    id:       raw.id       || String(Math.random()),
    name:     raw.name     || "",
    price:    typeof raw.price === "number" ? raw.price : 0,
    duration: typeof raw.duration === "number" ? raw.duration : 30,
  };
}

/**
 * Returns display label for a salon: "Name – Branch" or just "Name".
 * @param {Salon} salon
 * @returns {string}
 */
export function getSalonDisplayName(salon) {
  return salon.branch && salon.branch !== salon.name
    ? `${salon.name} – ${salon.branch}`
    : salon.name;
}

/**
 * Returns star string for a numeric rating.
 * @param {number} rating
 * @returns {string}
 */
export function getStarString(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? "½" : "";
  return "★".repeat(full) + half;
}
