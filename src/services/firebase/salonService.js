/**
 * SERVICE — salonService.js
 * Firestore CRUD for salons, bookings, reviews.
 * USE_MOCK = true  → local mock data (no Firebase needed)
 * USE_MOCK = false → Firestore (seed first via /admin)
 */
import {
  collection, getDocs, getDoc, doc,
  addDoc, query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { MOCK_SALONS } from "../api/mockData";
import { createSalon } from "../../models/SalonModel";
import { createBooking } from "../../models/BookingModel";
// ✅ Set true to use local mock data instantly (no Firestore needed)
// Set false after you've seeded Firestore via Admin Dashboard
const USE_MOCK = true;

// ── Salons ──────────────────────────────────────────────────────────────

export async function fetchSalons(filters = {}) {
  let data = [];

  if (USE_MOCK) {
    data = MOCK_SALONS.map(createSalon);
  } else {
    try {
      const snap = await getDocs(collection(db, "salons"));
      data = snap.docs.map(d => createSalon({ id: d.id, ...d.data() }));
      // If Firestore is empty, fall back to mock so page isn't blank
      if (data.length === 0) {
        console.warn("Firestore salons empty — falling back to mock data");
        data = MOCK_SALONS.map(createSalon);
      }
    } catch (err) {
      console.error("Firestore fetchSalons error — falling back to mock:", err.message);
      data = MOCK_SALONS.map(createSalon);
    }
  }

  // Apply filters in memory (works for both mock + Firestore)
  const { area, tag, search } = filters;
  if (area && area !== "All areas")
    data = data.filter(s => s.area === area);
  if (tag && tag !== "All")
    data = data.filter(s => s.tags.includes(tag));
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  return data;
}

export async function saveReview(review) {

  try {

    console.log("Saving review:", review);

    const ref = await addDoc(
      collection(db, "reviews"),
      {
        ...review,
        createdAt: serverTimestamp()
      }
    );

    console.log("Review saved:", ref.id);

    return ref.id;

  } catch (err) {


    console.error("saveReview error:", err);

    throw err;
  }
}

export async function fetchSalonById(id) {
  if (USE_MOCK) {
    const raw = MOCK_SALONS.find(s => s.id === id);
    return raw ? createSalon(raw) : null;
  }
  try {
    const snap = await getDoc(doc(db, "salons", id));
    if (snap.exists()) return createSalon({ id: snap.id, ...snap.data() });
    // Firestore miss — try mock
    const raw = MOCK_SALONS.find(s => s.id === id);
    return raw ? createSalon(raw) : null;
  } catch (err) {
    console.error("fetchSalonById error:", err.message);
    const raw = MOCK_SALONS.find(s => s.id === id);
    return raw ? createSalon(raw) : null;
  }
}

// ── Reviews ─────────────────────────────────────────────────────────────

export async function fetchReviews(salonId) {

  console.log("Fetching reviews for:", salonId);

  const q = query(
    collection(db, "reviews"),
    where("salonId", "==", salonId)
  );

  const snap = await getDocs(q);

  console.log("Documents found:", snap.docs.length);

  const data = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log(data);

  return data;
}

// ── Bookings ─────────────────────────────────────────────────────────────

export async function saveBooking(data) {
  const booking = createBooking(data);

  try {
    const ref = await addDoc(
      collection(db, "bookings"),
      {
        ...booking,
        createdAt: serverTimestamp(),
      }
    );

    return createBooking({
      ...booking,
      id: ref.id
    });

  } catch (err) {

    const existing =
      JSON.parse(
        localStorage.getItem("glamr_bookings") || "[]"
      );

    localStorage.setItem(
      "glamr_bookings",
      JSON.stringify([...existing, booking])
    );

    return booking;
  }
}
export async function fetchUserBookings(userId) {

  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function fetchAllBookings() {

  const snap = await getDocs(
    collection(db, "bookings")
  );

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ── Contact Messages ─────────────────────────────────────────────────────

export async function saveContactMessage(data) {
  const message = {
    ...data,
    createdAt: new Date().toISOString(),
    status: "unread",
    id: `msg_${Date.now()}`,
  };
  // Always save to localStorage as backup
  const existing = JSON.parse(localStorage.getItem("glamr_messages") || "[]");
  localStorage.setItem("glamr_messages", JSON.stringify([...existing, message]));

  if (!USE_MOCK) {
    try {
      await addDoc(collection(db, "contact_messages"), {
        ...message, createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("saveContactMessage Firestore error:", err.message);
      // localStorage backup already saved above
    }
  }
  return message;
}
