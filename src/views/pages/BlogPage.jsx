import Footer from "../components/layout/Footer";

const POSTS = [
  {
    title: "Top 10 bridal salons in Bangalore for 2026",
    category: "Bridal", date: "Mar 15, 2026", readTime: "5 min",
    excerpt: "Planning your big day? Here are the best bridal studios in Bangalore with full packages, pricing and real reviews.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    title: "Keratin vs smoothening — which is right for you?",
    category: "Hair Care", date: "Mar 8, 2026", readTime: "4 min",
    excerpt: "Both treatments promise frizz-free hair but they work differently. We break down the pros, cons and costs.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
  },
  {
    title: "The best areas to find a salon in Bangalore",
    category: "City Guide", date: "Feb 28, 2026", readTime: "6 min",
    excerpt: "From Indiranagar's luxury boutiques to Jayanagar's organic favourites — your neighbourhood-by-neighbourhood guide.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
  {
    title: "How to prep your skin before a facial",
    category: "Skin Care", date: "Feb 20, 2026", readTime: "3 min",
    excerpt: "Get the most out of your next salon facial with these simple pre-appointment tips from dermatologists.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <span className="section-eyebrow">✦ Beauty insights</span>
        <h1 className="section-title">Glamr Blog</h1>
        <p className="section-sub">Tips, guides and stories from Bangalore's beauty world.</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {POSTS.map((post, i) => (
            <article key={i} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", overflow: "hidden",
              transition: "transform 0.22s, border-color 0.22s",
              cursor: "pointer",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(255,79,139,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <img src={post.image} alt={post.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }} loading="lazy" />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: "999px", background: "rgba(255,79,139,0.1)",
                    color: "var(--pink)", border: "1px solid rgba(255,79,139,0.2)"
                  }}>{post.category}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{post.date} · {post.readTime} read</span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600,
                  lineHeight: 1.3, marginBottom: 10
                }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{post.excerpt}</p>
                <button
                  onClick={() => alert(`Full article: "${post.title}" — coming soon!`)}
                  style={{
                    marginTop: 16, fontSize: 13, fontWeight: 600,
                    color: "var(--pink)", background: "none",
                    border: "none", cursor: "pointer", padding: 0
                  }}>Read more →</button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}