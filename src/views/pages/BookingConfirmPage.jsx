import { useLocation, Link } from "react-router-dom";
import { formatPrice, formatDate } from "../../utils/helpers";
import Footer from "../components/layout/Footer";
import "./BookingConfirmPage.css";

export default function BookingConfirmPage() {
  const { state } = useLocation();

  if (!state?.booking) return (
    <div className="page">
      <div className="container" style={{ paddingTop:80, textAlign:"center" }}>
        <h2>Booking not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop:20 }}>Go home</Link>
      </div>
    </div>
  );

  const { booking, paid, total } = state;

  const rows = [
    ["Salon",      booking.salonName],
    ["Area",       `${booking.salonArea}, Bangalore`],
    ["Service",    booking.serviceName],
    ["Date",       formatDate(booking.date)],
    ["Time",       booking.slot],
    ["Amount",     formatPrice(booking.servicePrice)],
    ...(paid ? [
      ["GST (18%)",         formatPrice(Math.round(booking.servicePrice * 0.18))],
      ["Convenience fee",   formatPrice(29)],
      ["Total paid",        formatPrice(total || booking.servicePrice)],
      ["Payment status",    "✅ Paid"],
    ] : []),
    ["Booking ID", booking.id],
  ];

  return (
    <div className="page" style={{ paddingBottom:0 }}>
      <div className="confirm-page">
        <div className="confirm-card">
          <div className="confirm-check">✓</div>
          <h1>{paid ? "Payment successful!" : "Booking confirmed!"}</h1>
          <p className="confirm-sub">
            {paid
              ? "Your payment was processed and appointment is confirmed."
              : "Your appointment has been successfully booked."}
          </p>

          <div className="confirm-details">
            {rows.map(([label, value]) => (
              <div key={label} className="confirm-row">
                <span>{label}</span>
                <strong className={
                  label === "Total paid" ? "confirm-price" :
                  label === "Amount" && !paid ? "confirm-price" :
                  label === "Booking ID" ? "confirm-id" : ""
                }>{value}</strong>
              </div>
            ))}
          </div>

          <div className="confirm-note">
            <span>📩</span>
            <p>Confirmation sent to <strong>{booking.userEmail || "your email"}</strong></p>
          </div>

          <div className="confirm-actions">
            <Link to="/my-bookings" className="btn btn-outline">View all bookings</Link>
            <Link to="/salons"      className="btn btn-primary">Book another</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
