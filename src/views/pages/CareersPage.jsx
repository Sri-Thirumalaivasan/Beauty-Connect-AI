import Footer from "../components/layout/Footer";

const JOBS = [
  { title: "Frontend Engineer", team: "Engineering", type: "Full-time", location: "Bangalore / Remote" },
  { title: "Product Designer",  team: "Design",      type: "Full-time", location: "Bangalore" },
  { title: "Growth Marketer",   team: "Marketing",   type: "Full-time", location: "Bangalore" },
  { title: "Salon Partnerships Manager", team: "Business", type: "Full-time", location: "Bangalore" },
  { title: "Customer Success Executive", team: "Support",  type: "Full-time", location: "Remote" },
];

export default function CareersPage() {
  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <span className="section-eyebrow">Join us</span>
        <h1 className="section-title">Careers at Glamr</h1>
        <p className="section-sub" style={{ maxWidth: 560 }}>
          We're building the future of beauty discovery in India. Come work with a small,
          ambitious team that moves fast and cares deeply about design and experience.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 }}>
          {JOBS.map((job, i) => (
            <div key={i} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "var(--r-md)", padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12,
              transition: "border-color 0.2s",
              cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,79,139,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{job.title}</p>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>{job.team} · {job.location}</p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px",
                  borderRadius: "999px", background: "rgba(255,79,139,0.1)",
                  color: "var(--pink)", border: "1px solid rgba(255,79,139,0.2)"
                }}>{job.type}</span>
                <button
                  onClick={() => alert(`Apply for "${job.title}" — send your resume to hello@glamrbangalore.in`)}
                  style={{
                    padding: "8px 18px", borderRadius: "999px", fontSize: 13, fontWeight: 600,
                    background: "linear-gradient(135deg, var(--pink), var(--pink-dark))",
                    color: "#fff", border: "none", cursor: "pointer"
                  }}>Apply</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40, padding: "28px 32px",
          background: "rgba(255,79,139,0.06)", border: "1px solid rgba(255,79,139,0.2)",
          borderRadius: "var(--r-lg)", maxWidth: 760
        }}>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Don't see your role?</p>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            We're always looking for talented people. Send us your resume at{" "}
            <a href="mailto:hello@glamrbangalore.in" style={{ color: "var(--pink)" }}>
              hello@glamrbangalore.in
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}