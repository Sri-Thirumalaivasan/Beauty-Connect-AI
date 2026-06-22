import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  signUpUser, signInUser, signOutUser,
  subscribeToAuth, signInWithGoogle, signInWithFacebook,
} from "../services/firebase/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(undefined); // undefined = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAuth(setUser);
    return unsub;
  }, []);

  const register = useCallback(async (email, password, name) => {
    setError(null);
    try {
      await signUpUser(email, password, name);
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use"
        ? "This email is already registered."
        : "Sign up failed. Please try again.";
      setError(msg); throw new Error(msg);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      await signInUser(email, password);
    } catch (err) {
      const msg = err.code === "auth/invalid-credential"
        ? "Invalid email or password."
        : "Sign in failed. Please try again.";
      setError(msg); throw new Error(msg);
    }
  }, []);

  // Returns the user object (including email) so admin pages can check
  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      return result;
    } catch (err) {
      const msg =
        err.code === "auth/popup-closed-by-user" ? "Google sign-in was cancelled." :
        err.code === "auth/popup-blocked"        ? "Popup blocked. Please allow popups." :
        "Google sign-in failed. Please try again.";
      setError(msg); throw new Error(msg);
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    setError(null);
    try {
      await signInWithFacebook();
    } catch (err) {
      const msg =
        err.code === "auth/popup-closed-by-user" ? "Facebook sign-in was cancelled." :
        err.code === "auth/account-exists-with-different-credential"
          ? "An account already exists with this email." :
        "Facebook sign-in failed. Please try again.";
      setError(msg); throw new Error(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await signOutUser();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user, error,
      register, login,
      loginWithGoogle, loginWithFacebook,
      logout, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthController() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthController must be used inside AuthProvider");
  return ctx;
}
