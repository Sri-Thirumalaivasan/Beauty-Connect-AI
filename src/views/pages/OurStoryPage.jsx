import Footer from "../components/layout/Footer";

export default function OurStoryPage() {
  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <span className="section-eyebrow">About us</span>
        <h1 className="section-title">Our Story</h1>
        <p className="section-sub">How Glamr Bangalore came to be.</p>

        <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: 15 }}>
            Glamr Bangalore was born out of a simple frustration — booking a salon appointment
            in Bangalore was harder than it should be. Phone calls, WhatsApp messages, no-shows,
            and zero transparency on pricing. We set out to fix that.
          </p>
          <p style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: 15 }}>
            Founded in 2024, Glamr is Bangalore's first AI-powered beauty salon marketplace.
            We connect customers with the city's best salons — from budget-friendly neighbourhood
            gems to luxury destinations — with instant booking, real reviews and transparent pricing.
          </p>
          <p style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: 15 }}>
            Today, Glamr lists 500+ salons across 20 areas, has processed 10,000+ bookings,
            and is trusted by beauty lovers across Indiranagar, Koramangala, Whitefield and beyond.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16, marginTop: 16
          }}>
            {[
              { num: "500+", label: "Salons listed" },
              { num: "20",   label: "Areas covered" },
              { num: "10k+", label: "Bookings made" },
              { num: "4.7★", label: "Average rating" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "24px 20px",
                textAlign: "center"
              }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28, fontWeight: 700,
                  color: "var(--pink)"
                }}>{s.num}</p>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}