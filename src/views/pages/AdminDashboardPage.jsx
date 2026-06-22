import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSalonListController } from "../../controllers/SalonController";
import { useAuthController } from "../../controllers/AuthController";
import { fetchAllBookings } from "../../services/firebase/salonService";
import { formatPrice, formatDate } from "../../utils/helpers";
import Spinner from "../components/common/Spinner";
import Footer from "../components/layout/Footer";
import "./AdminDashboardPage.css";

const ADMIN_EMAILS = ["admin@glamr.com", "stvasan24@gmail.com"];

export default function AdminDashboardPage() {
  // ── All hooks FIRST — before any conditional returns ──
  const { user } = useAuthController();
  const { salons, loading: salonsLoading } = useSalonListController();
  const [bookings, setBookings] = useState([]);
  const [activeSection, setActiveSection] = useState("all");

  useEffect(() => {

    fetchAllBookings()
      .then(data => {
        console.log("Admin bookings:", data);
        setBookings(data);
      });
  
  }, []);

  // ── Guard after hooks ──
  if (user === undefined) return <Spinner />;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.servicePrice || 0), 0);
  const areas = [...new Set(salons.map(s => s.area))].length;
  const openSalons = salons.filter(s => s.openNow);

  const stats = [
    { key:"salons",   label:"Total salons",   value:salons.length,         icon:"💅" },
    { key:"bookings", label:"Total bookings",  value:bookings.length,       icon:"📅" },
    { key:"revenue",  label:"Revenue",         value:formatPrice(totalRevenue), icon:"💰" },
    { key:"areas",    label:"Active areas",    value:areas,                 icon:"📍" },
    { key:"open",     label:"Open now",        value:openSalons.length,     icon:"🟢" },
  ];

  return (
    <div className="page" style={{ paddingBottom:0 }}>
      <div className="container admin-page">

        <div className="admin-header">
          <div>
            <span className="section-eyebrow">⚙️ Management</span>
            <h1>Admin dashboard</h1>
            <p>Glamr Bangalore — marketplace overview</p>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <Link to="/admin/salons/edit" className="btn btn-primary">+ Add salon</Link>
          </div>
        </div>

        <div className="admin-stats">
          {stats.map(s => (
            <div key={s.key} className="stat-card"
              style={{ cursor:"pointer", border: activeSection === s.key ? "1px solid var(--primary)" : undefined }}
              onClick={() => setActiveSection(s.key)}>
              <span className="stat-icon">{s.icon}</span>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Salons */}
        {(activeSection === "all" || activeSection === "salons" || activeSection === "open" || activeSection === "areas") && (
          <>
            <hr className="divider" />
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:20 }}>
                {activeSection === "open" ? "Open salons" : "Registered salons"}
                <span style={{ fontSize:13, fontFamily:"var(--font-body)", color:"var(--muted)", fontWeight:400, marginLeft:10 }}>
                  ({activeSection === "open" ? openSalons.length : salons.length} total)
                </span>
              </h2>
              <Link to="/salons" className="btn btn-outline" style={{ fontSize:13, padding:"8px 18px" }}>View live →</Link>
            </div>

            {salonsLoading ? <Spinner /> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Salon</th><th>Branch</th><th>Area</th><th>Rating</th><th>Services</th><th>Price</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {(activeSection === "open" ? openSalons : salons).map((s, i) => (
                      <tr key={s.id}>
                        <td style={{ color:"var(--muted)", fontSize:12 }}>{i + 1}</td>
                        <td><strong>{s.name}</strong></td>
                        <td style={{ color:"var(--muted)" }}>{s.branch}</td>
                        <td>{s.area}</td>
                        <td><span style={{ color:"var(--gold)" }}>★</span> {s.rating} <span style={{ color:"var(--muted)", fontSize:11 }}>({s.reviewCount})</span></td>
                        <td style={{ color:"var(--muted)", fontSize:12 }}>{s.services?.length || 0} services</td>
                        <td>{s.priceRange}</td>
                        <td>
                          <span className="bk-status" style={s.openNow
                            ? { background:"rgba(52,211,153,0.12)", color:"#34d399", border:"1px solid rgba(52,211,153,0.25)" }
                            : { background:"rgba(248,113,113,0.1)", color:"#f87171", border:"1px solid rgba(248,113,113,0.25)" }}>
                            {s.openNow ? "● Open" : "● Closed"}
                          </span>
                        </td>
                        <td><Link to={`/salons/${s.id}`} className="admin-action-link">View →</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Bookings */}
        {(activeSection === "all" || activeSection === "bookings" || activeSection === "revenue") && (
          <>
            <hr className="divider" />
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:20 }}>
                Recent bookings
                <span style={{ fontSize:13, fontFamily:"var(--font-body)", color:"var(--muted)", fontWeight:400, marginLeft:10 }}>({bookings.length} total)</span>
              </h2>
            </div>

            {bookings.length === 0 ? (
              <div style={{ padding:"40px 24px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r-md)", textAlign:"center", marginBottom:40 }}>
                <p style={{ fontSize:32, marginBottom:12 }}>📅</p>
                <p style={{ fontWeight:600, marginBottom:6 }}>No bookings yet</p>
                <p style={{ fontSize:13, color:"var(--muted)" }}>Bookings made by customers will appear here.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Customer</th><th>Salon</th><th>Service</th><th>Date & Time</th><th>Amount</th><th>Booked At</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[...bookings]
                      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                      .map((b, i) => (
                        <tr key={b.id}>
                          <td style={{ color:"var(--muted)", fontSize:12 }}>{i + 1}</td>
                          <td>
                            <p style={{ fontWeight:500, fontSize:14 }}>{b.userName || "—"}</p>
                            <p style={{ fontSize:12, color:"var(--muted)" }}>{b.userEmail}</p>
                          </td>
                          <td>{b.salonName}</td>
                          <td>{b.serviceName}</td>
                          <td>
                            <p style={{ fontSize:13 }}>{formatDate(b.date)}</p>
                            <p style={{ fontSize:12, color:"var(--muted)" }}>{b.slot}</p>
                          </td>
                          <td style={{ color:"var(--gold)", fontWeight:600 }}>{formatPrice(b.servicePrice)}</td>
                          <td>{b.createdAt ? new Date(b.createdAt.seconds * 1000).toLocaleString() : "—"}</td>
                          <td>
                            <span className="bk-status" style={{ background:"rgba(52,211,153,0.12)", color:"#34d399", border:"1px solid rgba(52,211,153,0.25)" }}>
                              ✓ {b.status || "Confirmed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>
      <Footer />
    </div>
  );
}