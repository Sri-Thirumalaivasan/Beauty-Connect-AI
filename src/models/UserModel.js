/**
 * MODEL — UserModel.js
 * Defines User entity shape and helpers.
 */

/**
 * @typedef {Object} AppUser
 * @property {string}  uid
 * @property {string}  displayName
 * @property {string}  email
 * @property {boolean} emailVerified
 * @property {string}  role  - "user" | "admin"
 * @property {string|null} createdAt
 */

/**
 * Maps a Firebase User object to our AppUser model.
 * @param {import('firebase/auth').User} firebaseUser
 * @returns {AppUser}
 */
export function createUserFromFirebase(firebaseUser) {
  if (!firebaseUser) return null;
  return {
    uid:           firebaseUser.uid,
    displayName:   firebaseUser.displayName || "User",
    email:         firebaseUser.email || "",
    emailVerified: firebaseUser.emailVerified || false,
    role:          "user",
    createdAt:     firebaseUser.metadata?.creationTime || null,
  };
}

/**
 * Returns initials (first letter of displayName) for avatar.
 * @param {AppUser} user
 * @returns {string}
 */
export function getUserInitial(user) {
  return user?.displayName?.[0]?.toUpperCase() || "U";
}

/**
 * Returns first name only.
 * @param {AppUser} user
 * @returns {string}
 */
export function getUserFirstName(user) {
  return user?.displayName?.split(" ")[0] || "User";
}
