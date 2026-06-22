import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./HeroSlider.css";

const SLIDES = [
  {
    id: 1,
    eyebrow: "✦ Bangalore's #1 Salon Marketplace",
    title: <> Luxury Salon<br /><em>Experience</em> </>,
    sub: "Discover Bangalore's finest beauty destinations. From precision cuts to luxury spa treatments — book in seconds.",
    cta: "Browse Salons",        ctaLink: "/salons",
    secondary: "AI Stylist Finder", secondaryLink: "/ai-finder",
    bg: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=90",
  },
  {
    id: 2,
    eyebrow: "💍 Bridal Beauty Services",
    title: <> Your Perfect<br /><em>Bridal Look</em> </>,
    sub: "Award-winning bridal artists across Bangalore. Makeup, hair, mehendi and full bridal packages tailored for your special day.",
    cta: "Find Bridal Salons", ctaLink: "/salons?tag=Bridal",
    secondary: "View Packages",  secondaryLink: "/salons?tag=Bridal",
    bg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=90",
  },
  {
    id: 3,
    eyebrow: "💅 Hair & Skin Specialists",
    title: <> Expert Hair &<br /><em>Skin Care</em> </>,
    sub: "Keratin treatments, balayage, organic facials and advanced skin therapies from certified professionals across the city.",
    cta: "Explore Hair Services", ctaLink: "/salons?tag=Hair",
    secondary: "Skin Treatments",  secondaryLink: "/salons?tag=Skin",
    bg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=90",
  },
  {
    id: 4,
    eyebrow: "🌟 Premium Bangalore Salons",
    title: <> 500+ Salons<br /><em>Across the City</em> </>,
    sub: "From Indiranagar to Electronic City — find top-rated salons in every neighbourhood with instant booking confirmation.",
    cta: "Browse by Area",  ctaLink: "/salons",
    secondary: "Try AI Finder", secondaryLink: "/ai-finder",
    bg: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1600&q=90",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="hero-slider">
      {SLIDES.map((slide, i) => (
        <div key={slide.id} className={`hero-slide${i === current ? " active" : ""}`}>
          <div className="hero-slide-bg" style={{ backgroundImage: `url(${slide.bg})` }} />
          <div className="hero-slide-overlay" />
          <div className="container">
            <div className={`hero-slide-content${i !== current ? " hidden" : ""}`}>
              <div className="hero-slide-eyebrow">
                <span className="hero-slide-dot" />
                {slide.eyebrow}
              </div>
              <h1 className="hero-slide-title">{slide.title}</h1>
              <p className="hero-slide-sub">{slide.sub}</p>
              {/* ── CTA buttons only — NO search bar on any slide ── */}
              <div className="hero-slide-actions">
                <Link to={slide.ctaLink} className="btn btn-primary"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  {slide.cta}
                </Link>
                <Link to={slide.secondaryLink} className="btn btn-outline"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  {slide.secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="slider-arrow prev" onClick={prev} aria-label="Previous">‹</button>
      <button className="slider-arrow next" onClick={next} aria-label="Next">›</button>

      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button key={i}
            className={`slider-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
