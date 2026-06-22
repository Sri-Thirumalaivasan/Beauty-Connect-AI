/**
 * SERVICE — firebaseConfig.js
 * Initialises and exports Firebase app instances.
 * All firebase access goes through this file.
 */
import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore }  from "firebase/firestore";
import { getStorage }    from "firebase/storage";

// ⚠️  Replace with your Firebase project credentials
// https://console.firebase.google.com → Project Settings → Web app
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY            || "AIzaSyA6WidhbKTDnIRODtJpzna1lszybX2XJ9I",
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN        || "beauty-connect-ai.firebaseapp.com",
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID         || "beauty-connect-ai",
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET     || "beauty-connect-ai.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID|| "922682072204",
  appId:             process.env.REACT_APP_FIREBASE_APP_ID             || "1:922682072204:web:b886318ec0a3625846afa9",
};

const app     = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
