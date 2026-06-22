import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthController } from "../../controllers/AuthController";
import "./LoginPage.css";

export default function SignupPage() {
  const { register, loginWithGoogle,  error: authError, clearError } = useAuthController();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [localErr, setLocalErr] = useState("");
  const [socialLoading, setSocialLoading] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setLocalErr("Password must be at least 6 characters."); return; }
    setLocalErr(""); setLoading(true);
    try { await register(email, password, name); navigate("/"); }
    catch {}
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setSocialLoading("google");
    try { await loginWithGoogle(); navigate("/"); }
    catch {}
    finally { setSocialLoading(""); }
  };

  const displayError = localErr || authError;

  return (
    <div className="page" style={{ paddingBottom: 0, minHeight: "100vh" }}>
      <div className="auth-page">

        {/* Left image panel */}
        <div className="auth-image-panel">
          <div className="auth-bg-slideshow">
            <div className="auth-bg-slide" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=900&q=85)", animationDelay:"0s" }} />
            <div className="auth-bg-slide" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1485231183945-fffde7b4e37f?w=900&q=85)", animationDelay:"4s" }} />
            <div className="auth-bg-slide" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=85)", animationDelay:"8s" }} />
          </div>
          <div className="auth-image-overlay" />

          <div className="auth-image-content">
            <span className="auth-brand">Glamr Bangalore</span>
            <h2>Join thousands of beauty lovers across Bangalore</h2>
            <p>Get instant access to 500+ top-rated salons, exclusive offers and easy online booking.</p>
            <div className="auth-image-dots">
              <div className="auth-image-dot" />
              <div className="auth-image-dot active" />
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
              <h1>Create <span>account</span></h1>
            </div>

            {displayError && <div className="auth-error">⚠️ {displayError}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input className="form-control" type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Priya Sharma" required />
                </div>
              </div>
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
                    placeholder="Min. 6 characters" required />
                  <button type="button" className="auth-input-toggle"
                    onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? "Creating account…" : "Create account →"}
              </button>
            </form>

            <div className="auth-divider">or sign up with</div>
            <div className="auth-social">
              <button className="auth-social-btn" onClick={handleGoogle}
                disabled={socialLoading === "google"}>
                {socialLoading === "google" ? "..." : "🌐"} Google
              </button>
            </div>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            <p className="auth-terms">
              By creating an account you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
