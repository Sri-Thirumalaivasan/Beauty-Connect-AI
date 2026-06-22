import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthController } from "../../controllers/AuthController";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, loginWithGoogle, error: authError, clearError } = useAuthController();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); navigate("/dashboard"); }
    catch {}
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setSocialLoading("google");
    try { await loginWithGoogle(); navigate("/dashboard"); }
    catch {}
    finally { setSocialLoading(""); }
  };



  return (
    <div className="page" style={{ paddingBottom: 0, minHeight: "100vh" }}>
      <div className="auth-page">

        {/* Left image panel */}
        <div className="auth-image-panel">
          <div className="auth-bg-slideshow">
            <div className="auth-bg-slide" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=85)", animationDelay:"0s" }} />
            <div className="auth-bg-slide" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85)", animationDelay:"4s" }} />
            <div className="auth-bg-slide" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=85)", animationDelay:"8s" }} />
          </div>
          <div className="auth-image-overlay" />

          <div className="auth-image-content">
            <span className="auth-brand">Glamr Bangalore</span>
            <h2>Welcome back to Bangalore's favourite beauty marketplace</h2>
            <p>Your next salon appointment is just a few clicks away.</p>
            <div className="auth-image-dots">
              <div className="auth-image-dot active" />
              <div className="auth-image-dot" />
              <div className="auth-image-dot" />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-logo">
              <span className="auth-logo-mark">Glamr</span>
              <span className="auth-logo-city">Bangalore</span>
            </div>
            <div>
              <h1>Welcome <span>back</span></h1>
            </div>

            {authError && <div className="auth-error">⚠️ {authError}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input className="form-control" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); clearError(); }}
                    placeholder="you@example.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input className="form-control"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required />
                  <button type="button" className="auth-input-toggle"
                    onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </form>

            <div className="auth-divider">or continue with</div>
            <div className="auth-social">
              <button className="auth-social-btn" onClick={handleGoogle}
                disabled={socialLoading === "google"}>
                {socialLoading === "google" ? "..." : "🌐"} Google
              </button>
            </div>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Create one free</Link>
            </p>
            <p className="auth-terms">
              By signing in you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
