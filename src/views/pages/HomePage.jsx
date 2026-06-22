import { Link } from "react-router-dom";
import { useHomeSalonsController } from "../../controllers/SalonController";
import HeroSlider from "../components/ui/HeroSlider";
import SalonCard from "../components/ui/SalonCard";
import Footer from "../components/layout/Footer";
import { MARQUEE_ITEMS, AREA_SALON_COUNTS } from "../../utils/constants";
import "./HomePage.css";

const marquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

const HOW_STEPS = [
  { icon:"🔍", title:"Browse Salons",    desc:"Explore 500+ salons by area, service, price or rating across Bangalore", link:"/salons",    num:"01" },
  { icon:"✦",  title:"Compare Services", desc:"View full service menus, pricing and real customer reviews side by side",  link:"/salons",    num:"02" },
  { icon:"📅", title:"Book Appointment", desc:"Choose your slot and confirm instantly — no phone calls or waiting",       link:"/salons",    num:"03" },
  { icon:"💅", title:"Glow Up",          desc:"Walk in, get pampered and share your experience with the community",       link:"/ai-finder", num:"04" },
];

export default function HomePage() {
  const { featured, topRated } = useHomeSalonsController();

  return (
    /* HomePage overrides the global padding-top:68px because
       HeroSlider handles the navbar offset internally with padding-top on each slide */
    <div className="page home-page" style={{ paddingTop: 0 }}>

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Marquee strip ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {marquee.map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── AI Banner ── */}
      <div className="container ai-banner-wrap">
        <div className="ai-banner-inner">
          <div className="ai-banner-left">
            <span className="ai-banner-eyebrow">✦ Powered by Claude AI</span>
            <h2>Not sure which salon<br />to choose?</h2>
            <p>Describe what you're looking for — our AI stylist recommends the perfect match for your needs in seconds.</p>
          </div>
          <div className="ai-banner-actions">
            <Link to="/ai-finder" className="btn btn-primary">Try AI Stylist Finder</Link>
            <span className="ai-banner-note">Free · No sign-in needed</span>
          </div>
        </div>
      </div>

      {/* ── Featured salons ── */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <span className="section-eyebrow">✦ Handpicked</span>
              <h2 className="section-title">Featured salons</h2>
            </div>
            <Link to="/salons" className="view-all-link">View all salons →</Link>
          </div>
          <div className="grid-3">
            {featured.map(s => <SalonCard key={s.id} salon={s} />)}
          </div>
        </div>
      </section>

      {/* ── Top rated ── */}
      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <span className="section-eyebrow">★ Highest rated</span>
              <h2 className="section-title">Top rated in Bangalore</h2>
            </div>
            <Link to="/salons?sort=rating" className="view-all-link">See all →</Link>
          </div>
          <div className="grid-3">
            {topRated.map(s => <SalonCard key={s.id} salon={s} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 40 }}>
            <div className="section-header-left">
              <span className="section-eyebrow">How it works</span>
              <h2 className="section-title">Book in under 2 minutes</h2>
            </div>
          </div>
          <div className="steps">
            {HOW_STEPS.map((step, i) => (
              <Link key={i} to={step.link} className="step-card" data-num={step.num}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <div className="step-icon-wrap">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <span className="step-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by area ── */}
      <section className="areas-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <span className="section-eyebrow">📍 Explore</span>
              <h2 className="section-title">Browse by area</h2>
            </div>
          </div>
          <div className="areas-grid">
            {Object.entries(AREA_SALON_COUNTS).map(([area, count]) => (
              <Link key={area}
                to={`/salons?area=${encodeURIComponent(area)}`}
                className="area-chip"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <span className="area-chip-name">{area}</span>
                <span className="area-chip-count">{count} salons</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
