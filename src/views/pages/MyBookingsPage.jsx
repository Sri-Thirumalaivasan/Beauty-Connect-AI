import { Link } from "react-router-dom";
import { useAuthController } from "../../controllers/AuthController";
import { useUserBookingsController } from "../../controllers/BookingController";
import { formatPrice, formatDate } from "../../utils/helpers";
import Spinner from "../components/common/Spinner";
import Footer from "../components/layout/Footer";
import "./MyBookingsPage.css";

export default function MyBookingsPage() {
  const { user } = useAuthController();
  const { bookings, loading } = useUserBookingsController(user?.uid);

  if (loading) return <div className="page"><Spinner /></div>;

  return (
    <div className="page bookings-page">
      <div className="container">
        <div className="bookings-header">
          <span className="section-eyebrow">📅 Your appointments</span>
          <h1>My bookings</h1>
          <p>All your upcoming and past salon appointments</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state" style={{ paddingBottom: 80 }}>
            <span className="empty-state-icon">📅</span>
            <h3>No bookings yet</h3>
            <p>Browse salons and book your first appointment</p>
            <Link to="/salons" className="btn btn-primary" style={{ marginTop: 12 }}>Browse salons</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(bk => (
              <div key={bk.id} className="booking-item">
                <div className="booking-item-left">
                  <h3>{bk.salonName}</h3>
                  <p className="bk-area">📍 {bk.salonArea}, Bangalore</p>
                  <p className="bk-svc">{bk.serviceName}</p>
                </div>
                <div className="booking-item-right">
                  <div className="bk-date"><span className="bk-label">Date</span><strong>{formatDate(bk.date)}</strong></div>
                  <div className="bk-date"><span className="bk-label">Time</span><strong>{bk.slot}</strong></div>
                  <div className="bk-date"><span className="bk-label">Amount</span><strong style={{ color: "var(--gold)" }}>{formatPrice(bk.servicePrice)}</strong></div>
                  <span className={`bk-status ${(bk.status || "confirmed").toLowerCase()}`}>
                    {bk.status || "Confirmed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}