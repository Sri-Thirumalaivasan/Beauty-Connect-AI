import Footer from "../components/layout/Footer";

const PRESS = [
  { outlet: "YourStory",      date: "Mar 2026", headline: "Glamr Bangalore is redefining how the city books beauty appointments", logo: "📰" },
  { outlet: "Inc42",          date: "Feb 2026", headline: "This AI-powered salon marketplace wants to be the Zomato of beauty", logo: "📋" },
  { outlet: "Economic Times", date: "Jan 2026", headline: "Glamr raises seed round to expand Bangalore's salon discovery platform", logo: "📊" },
  { outlet: "Deccan Herald",  date: "Dec 2025", headline: "Bangalore startup Glamr brings AI to salon bookings", logo: "🗞️" },
];

export default function PressPage() {
  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <span className="section-eyebrow">Media</span>
        <h1 className="section-title">Press & Media</h1>
        <p className="section-sub" style={{ maxWidth: 540 }}>
          For press enquiries, interviews or media assets, contact us at{" "}
          <a href="mailto:press@glamrbangalore.in" style={{ color: "var(--pink)" }}>
            press@glamrbangalore.in
          </a>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
          {PRESS.map((item, i) => (
            <div key={i} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "var(--r-md)", padding: "24px",
              display: "flex", gap: 20, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{item.logo}</span>
              <div>
                <p style={{ fontSize: 12, color: "var(--pink)", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  {item.outlet} · {item.date}
                </p>
                <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{item.headline}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40, padding: "32px",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", maxWidth: 760
        }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 12 }}>Press kit</h3>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
            Download our brand assets, logos and product screenshots.
          </p>
          <a
  href="/pdf/glamr-banglore.pdf"
  download
  style={{
    display: "inline-block",
    padding: "10px 24px",
    borderRadius: "999px",
    fontSize: 14,
    fontWeight: 600,
    background: "linear-gradient(135deg, var(--pink), var(--pink-dark))",
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer"
  }}
>
  Download press kit
</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}