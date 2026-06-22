import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function AdminSignupPage() {
  return (
    <div className="page" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="auth-card" style={{ maxWidth:460, textAlign:"center" }}>
        <div className="auth-logo">
          <span className="auth-logo-mark">Glamr</span>
          <span className="auth-logo-city" style={{ background:"rgba(255,79,139,0.15)", color:"var(--pink)" }}>Admin</span>
        </div>
        <span style={{ fontSize:48 }}>🔒</span>
        <h2 style={{ marginTop:16 }}>Admin registration is closed</h2>
        <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.6, marginTop:10 }}>
          Admin accounts are created and managed by Glamr's technical team.
          Contact the project administrator to have your email added to the authorised list.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:24 }}>
          <Link to="/admin-login" className="btn btn-primary">Go to Admin Login</Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}