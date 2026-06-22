import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { createUserFromFirebase } from "../../models/UserModel";

export async function signUpUser(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return createUserFromFirebase(cred.user);
}

export async function signInUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return createUserFromFirebase(cred.user);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  const cred = await signInWithPopup(auth, provider);
  // Return both the AppUser model AND the raw Firebase user email for admin checks
  const appUser = createUserFromFirebase(cred.user);
  return { ...appUser, email: cred.user.email };
}

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  provider.addScope("email");
  const cred = await signInWithPopup(auth, provider);
  return createUserFromFirebase(cred.user);
}

export async function signOutUser() {
  return signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, (fbUser) => {
    callback(fbUser ? createUserFromFirebase(fbUser) : null);
  });
}
