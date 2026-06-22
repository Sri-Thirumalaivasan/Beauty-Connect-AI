import { useNavigate } from "react-router-dom";
import { CONTACT_INFO, SOCIAL_LINKS } from "../../../utils/constants";
import "./Footer.css";

function ScrollLink({ to, children, className }) {
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate(to), 80);
  };
  return <a href={to} onClick={handle} className={className}>{children}</a>;
}

function AnchorLink({ href, children }) {
  const handle = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <a href={href} onClick={handle}>{children}</a>;
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <ScrollLink to="/" className="footer-logo">Glamr Bangalore</ScrollLink>
            <p>Bangalore's premium beauty salon marketplace. Discover, compare and book the city's best salons — hair, skin, bridal and beyond.</p>
            <div className="footer-social">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
              </a>
            </div>
          </div>

          {/* About */}
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><ScrollLink to="/our-story">Our Story</ScrollLink></li>
              <li><ScrollLink to="/careers">Careers</ScrollLink></li>
              <li><ScrollLink to="/press">Press</ScrollLink></li>
              <li><ScrollLink to="/blog">Blog</ScrollLink></li>
              <li><ScrollLink to="/admin">Admin Portal</ScrollLink></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><ScrollLink to="/salons">Browse Salons</ScrollLink></li>
              <li><ScrollLink to="/ai-finder">AI Stylist Finder</ScrollLink></li>
              <li><ScrollLink to="/my-bookings">My Bookings</ScrollLink></li>
              <li><ScrollLink to="/salons?tag=Bridal">Bridal Services</ScrollLink></li>
              <li><ScrollLink to="/salons?tag=Luxury">Luxury Salons</ScrollLink></li>
              <li><ScrollLink to="/contact">Contact Us</ScrollLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <p>{CONTACT_INFO.address}</p>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">🕐</span>
                <p>Mon – Sat: 9 AM – 9 PM</p>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 Glamr Bangalore. All rights reserved. Built for SuperXgen AI Startup Buildathon.</p>
          <div className="footer-bottom-links">
            <AnchorLink href="#privacy">Privacy Policy</AnchorLink>
            <AnchorLink href="#terms">Terms of Service</AnchorLink>
            <AnchorLink href="#refund">Refund Policy</AnchorLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
