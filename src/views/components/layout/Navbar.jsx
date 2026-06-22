import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthController } from "../../../controllers/AuthController";
import { getUserInitial, getUserFirstName } from "../../../models/UserModel";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuthController();
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
            <Link to="/contact"  className={isActive("/contact")  ? "active" : ""} onClick={close}>Contact Us</Link>

            {user ? (
              <div className="nav-user-menu">
                <div className="nav-avatar" aria-label="User menu">
                  {getUserInitial(user)}
                </div>
                <div className="nav-dropdown">
                  <span className="nav-greeting">Hi, {getUserFirstName(user)}</span>
                  <Link to="/my-bookings" onClick={close}>My Bookings</Link>
                  <Link to="/profile"     onClick={close}>Profile</Link>
                  <Link to="/dashboard"       onClick={close}>Dashboard</Link>
                  <button onClick={handleLogout}>Sign out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn nav-cta" onClick={close}>Login</Link>
            )}
          </div>

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
