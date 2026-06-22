import { Link, useNavigate } from "react-router-dom";
import { useAuthController } from "../../controllers/AuthController";
import { getUserInitial} from "../../models/UserModel";
import { formatDate } from "../../utils/helpers";
import Footer from "../components/layout/Footer";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useAuthController();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <div className="page" style={{paddingBottom:0}}>
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">{getUserInitial(user)}</div>
          <h1 className="profile-name">{user.displayName}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-actions">
            <Link to="/my-bookings" className="btn btn-outline profile-btn">📅 My bookings</Link>
            <button className="btn btn-outline profile-btn"
              onClick={async () => { await logout(); navigate("/"); }}>
              Sign out
            </button>
          </div>
          <div className="profile-info">
            <div className="profile-info-row">
              <span>Member since</span>
              <strong>{formatDate(user.createdAt) || "—"}</strong>
            </div>
            <div className="profile-info-row">
              <span>Email verified</span>
              <strong style={{color: user.emailVerified ? "var(--success)" : "var(--error)"}}>
                {user.emailVerified ? "Yes ✓" : "No"}
              </strong>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
