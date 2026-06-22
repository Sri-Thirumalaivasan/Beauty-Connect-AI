import { Navigate } from "react-router-dom";
import { useAuthController } from "../../../controllers/AuthController";
import Spinner from "./Spinner";

const ADMIN_EMAILS = ["admin@glamr.com", "stvasan24@gmail.com"];

export default function AdminRoute({ children }) {
  const { user } = useAuthController();

  if (user === undefined) return <Spinner />;

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return children;
}