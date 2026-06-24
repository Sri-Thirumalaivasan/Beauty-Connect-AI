import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthController } from "../../../controllers/AuthController";
import { useTheme } from "../../../controllers/ThemeController";
import { getUserInitial, getUserFirstName } from "../../../models/UserModel";
import "./Navbar.css";

/* ── Sun icon SVG ── */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

/* ── Moon icon SVG ── */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout }    = useAuthController();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Sticky scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (p) => location.pathname === p;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={close}>
            <span className="logo-glamr">Glamr</span>
            <span className="logo-city">Bangalore</span>
          </Link>

          {/* Nav links */}
          <div className={`navbar-links${menuOpen ? " open" : ""}`}>
            <Link to="/"         className={isActive("/")         ? "active" : ""} onClick={close}>Home</Link>
            <Link to="/salons"   className={isActive("/salons")   ? "active" : ""} onClick={close}>Salons</Link>
            <Link to="/ai-finder" className={`nav-ai-link${isActive("/ai-finder") ? " active" : ""}`} onClick={close}>
              ✦ AI Stylist
            </Link>
            <Link to="/contact"  className={isActive("/contact")  ? "active" : ""} onClick={close}>Contact</Link>

            {user ? (
              <div className="nav-user-menu">
                <div className="nav-avatar" aria-label="User menu">
                  {getUserInitial(user)}
                </div>
                <div className="nav-dropdown">
                  <span className="nav-greeting">Hi, {getUserFirstName(user)}</span>
                  <Link to="/my-bookings" onClick={close}>My Bookings</Link>
                  <Link to="/profile"     onClick={close}>Profile</Link>
                  <Link to="/dashboard"   onClick={close}>Dashboard</Link>
                  <button onClick={handleLogout}>Sign out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn nav-cta" onClick={close}>Login</Link>
            )}

            {/* Theme toggle — mobile: inside menu */}
            {/* <button
              className="theme-toggle theme-toggle-mobile"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="icon-sun"><SunIcon /></span>
              <span className="icon-moon"><MoonIcon /></span>
            </button> */}
          </div>

          {/* Right controls: theme toggle + hamburger */}
          <div className="navbar-controls">
            {/* Theme toggle — desktop */}
            <button
              className="theme-toggle theme-toggle-desktop"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="icon-sun"><SunIcon /></span>
              <span className="icon-moon"><MoonIcon /></span>
            </button>

            {/* Hamburger */}
            <button
              className={`navbar-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay — closes menu when tapping outside */}
      {menuOpen && (
        <div
          style={{
            position:"fixed", inset:0, zIndex:198,
            background:"rgba(0,0,0,0.4)", backdropFilter:"blur(2px)",
          }}
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
}
