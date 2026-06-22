import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthController } from "../../controllers/AuthController";
import "./LoginPage.css";

const ADMIN_EMAILS = ["admin@glamr.com", "stvasan24@gmail.com"];

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuthController();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!ADMIN_EMAILS.includes(email)) {
      setError("Access denied. This login is for admins only.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setSocialLoading("google");
    try {
      const result = await loginWithGoogle();
      const userEmail = result?.email || "";
      if (ADMIN_EMAILS.includes(userEmail)) {
        navigate("/admin");
      } else {
        setError("Unauthorised admin account.");
      }
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <div className="page" style={{ paddingBottom: 0, minHeight: "100vh" }}>
      <div className="auth-page">

        <div className="auth-image-panel">
          <div className="auth-bg-slideshow">
            <div className="auth-bg-slide" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=85)", animationDelay: "0s" }} />
            <div className="auth-bg-slide" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=85)", animationDelay: "4s" }} />
            <div className="auth-bg-slide" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=900&q=85)", animationDelay: "8s" }} />
          </div>
          <div className="auth-image-overlay" />
          <div className="auth-float-card auth-float-card-1">
            <span style={{ fontSize: 22 }}>⚙️</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>Admin Portal</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Glamr Bangalore</p>
            </div>
          </div>
          <div className="auth-float-card auth-float-card-2">
            <span style={{ fontSize: 22 }}>📊</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>43 Salons</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Across Bangalore</p>
            </div>
          </div>
          <div className="auth-float-card auth-float-card-3">
            <span style={{ fontSize: 22 }}>🔒</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>Secure Access</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Authorised only</p>
            </div>
          </div>
          <div className="auth-image-content">
            <span className="auth-brand">Glamr Bangalore</span>
            <h2>Administration Portal</h2>
            <p>Manage salons, bookings, and marketplace operations from a single dashboard.</p>
            <div className="auth-image-dots">
              <div className="auth-image-dot active" />
              <div className="auth-image-dot" />
              <div className="auth-image-dot" />
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-logo">
              <span className="auth-logo-mark">Glamr</span>
              <span className="auth-logo-city" style={{ background: "rgba(255,79,139,0.15)", color: "var(--pink)" }}>Admin</span>
            </div>
            <div>
              <h1>Admin <span>Login</span></h1>
              <p className="auth-sub">Sign in to manage Glamr Bangalore</p>
            </div>

            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
              <p style={{ fontSize: 12, color: "rgba(253,230,138,0.85)", lineHeight: 1.55 }}>
                Restricted access — authorised administrators only.
              </p>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Admin email</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input className="form-control" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@glamr.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Admin password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input className="form-control"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter admin password" required />
                  <button type="button" className="auth-input-toggle"
                    onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? "Verifying…" : "Sign in to Admin →"}
              </button>
            </form>

            <div className="auth-divider">or continue with</div>
            <div className="auth-social">
              <button className="auth-social-btn" onClick={handleGoogle}
                disabled={socialLoading === "google"}>
                {socialLoading === "google" ? "Signing in..." : "🌐 Google"}
              </button>
            </div>

            <p className="auth-switch">
              Not an admin? <Link to="/login">Go to user login</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}