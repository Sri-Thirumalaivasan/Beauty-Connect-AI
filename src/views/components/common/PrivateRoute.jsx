/**
 * VIEW — PrivateRoute.jsx
 * Redirects to /login if user is not authenticated.
 */
import { Navigate } from "react-router-dom";
import { useAuthController } from "../../../controllers/AuthController";
import Spinner from "./Spinner";

export default function PrivateRoute({ children }) {
  const { user } = useAuthController();
  if (user === undefined) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}
