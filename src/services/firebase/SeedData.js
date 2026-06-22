import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { MOCK_SALONS, MOCK_REVIEWS } from "../api/mockData";

/**
 * Run this ONCE to upload all mock salons to Firestore.
 * Call seedSalons() from browser console or a temp button.
 */
export async function seedSalons() {
  try {
    // Firestore batch write — max 500 docs per batch
    const batch = writeBatch(db);

    MOCK_SALONS.forEach(salon => {
      const ref = doc(collection(db, "salons"), salon.id);
      batch.set(ref, salon);
    });

    await batch.commit();
    console.log(`✅ Seeded ${MOCK_SALONS.length} salons to Firestore`);

    // Seed reviews
    const reviewBatch = writeBatch(db);
    Object.entries(MOCK_REVIEWS).forEach(([salonId, reviews]) => {
      reviews.forEach(review => {
        const ref = doc(collection(db, "reviews"), review.id);
        reviewBatch.set(ref, { ...review, salonId });
      });
    });
    await reviewBatch.commit();
    console.log("✅ Seeded reviews to Firestore");

  } catch (err) {
    console.error("❌ Seed failed:", err);
  }
}