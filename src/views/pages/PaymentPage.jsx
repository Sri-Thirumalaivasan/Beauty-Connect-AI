import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthController } from "../../controllers/AuthController";
import { saveBooking } from "../../services/firebase/salonService";
import { formatPrice } from "../../utils/helpers";
import Footer from "../components/layout/Footer";
import QRCode from "react-qr-code";
import "./PaymentPage.css";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm, BHIM" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major Indian banks" },
  { id: "wallet", label: "Wallets", icon: "👛", desc: "Paytm, Amazon Pay, Mobikwik" },
  { id: "qr", label: "QR Payment", icon: "🔳", desc: "Scan using any UPI app" },
];

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthController();

  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("SBI");
  const [wallet, setWallet] = useState("Paytm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Booking details passed via navigation state
  const { salon, service, date, slot } = state || {};

  if (!salon || !service) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 80, textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
          <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>No booking details found</h2>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>
            Please start a booking from a salon page.
          </p>
          <Link to="/salons" className="btn btn-primary">Browse Salons</Link>
        </div>
      </div>
    );
  }

  const subtotal = service.price;
  const gst = Math.round(subtotal * 0.18);
  const convenience = 29;
  const total = subtotal + gst + convenience;
  const qrData = `upi://pay?pa=vignesh.us21-2@okhdfcbank&pn=Beauty Connect AI&am=${total}&cu=INR`;

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const validate = () => {
    if (payMethod === "upi") {
      const upiRegex =
        /^[a-zA-Z0-9._-]{2,100}@(ybl|ibl|okaxis|oksbi|okicici|axl|upi)$/i;

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !upiRegex.test(upiId) ||
        emailRegex.test(upiId)
      ) {
        setError(
          "Enter valid UPI ID like name@ybl"
        );
        return false;
      }
    }
    if (payMethod === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) { setError("Enter a valid 16-digit card number"); return false; }
      if (!cardName.trim()) { setError("Enter the cardholder name"); return false; }
      if (cardExp.length < 5) { setError("Enter a valid expiry date (MM/YY)"); return false; }
      if (cardCvv.length < 3) { setError("Enter a valid CVV"); return false; }
    }
    return true;
  };

  const handlePay = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);

    // Simulate payment gateway processing (1.5s)
    await new Promise(r => setTimeout(r, 1500));

    try {
      const booking = await saveBooking({
        salonId: salon.id,
        salonName: salon.name,
        salonArea: salon.area,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        date, slot,
        userId: user?.uid || "guest",
        userName: user?.displayName || "Guest",
        userEmail: user?.email || "",
        paymentMethod: payMethod,
        paymentStatus: "paid",
        totalPaid: total,
        transactionId: "TXN"+Date.now(),
        paymentId: "PAY"+Date.now(),
      });
      navigate(`/booking/${booking.id}/confirm`, {
        state: { booking, salon, paid: true, total },
      });
    } catch (err) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }

    if (payMethod === "qr") {
      alert(
        "After scanning QR and completing payment, click OK to confirm payment."
      );
    }

  };

  return (
    <div className="page payment-page" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="payment-header">
          <button className="payment-back" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <span className="section-eyebrow">💳 Secure checkout</span>
            <h1>Complete payment</h1>
          </div>
        </div>

        <div className="payment-grid">

          {/* ── Left: Payment form ── */}
          <div className="payment-form-col">

            {/* Method selector */}
            <div className="payment-section">
              <h3 className="payment-section-title">Choose payment method</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    className={`payment-method-card${payMethod === m.id ? " active" : ""}`}
                    onClick={() => { setPayMethod(m.id); setError(""); }}
                  >
                    <span className="pm-icon">{m.icon}</span>
                    <div>
                      <p className="pm-label">{m.label}</p>
                      <p className="pm-desc">{m.desc}</p>
                    </div>
                    <span className="pm-radio">
                      {payMethod === m.id ? "🔘" : "⭕"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI */}
            {payMethod === "upi" && (
              <div className="payment-section">
                <h3 className="payment-section-title">Enter UPI ID</h3>
                <div className="upi-logos">
                  {["G Pay", "PhonePe", "Paytm", "BHIM"].map(u => (
                    <span key={u} className="upi-logo-chip">{u}</span>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Your UPI ID</label>
                  <input className="form-control" type="text"
                    placeholder="yourname@okaxis"
                    value={upiId}
                    onChange={e => { setUpiId(e.target.value); setError(""); }} />
                </div>
              </div>
            )}

            {/* Card */}
            {payMethod === "card" && (
              <div className="payment-section">
                <h3 className="payment-section-title">Card details</h3>
                <div className="card-logos">
                  {["VISA", "Mastercard", "RuPay", "Amex"].map(c => (
                    <span key={c} className="card-logo-chip">{c}</span>
                  ))}
                </div>
                <div className="card-form">
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label>Card number</label>
                    <input className="form-control" type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNum}
                      maxLength={19}
                      onChange={e => { setCardNum(formatCard(e.target.value)); setError(""); }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label>Cardholder name</label>
                    <input className="form-control" type="text"
                      placeholder="As on card"
                      value={cardName}
                      onChange={e => { setCardName(e.target.value); setError(""); }} />
                  </div>
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input className="form-control" type="text"
                      placeholder="08/27"
                      value={cardExp}
                      maxLength={5}
                      onChange={e => { setCardExp(formatExpiry(e.target.value)); setError(""); }} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input className="form-control" type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => { setCardCvv(e.target.value.replace(/\D/g, "")); setError(""); }} />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {payMethod === "netbanking" && (
              <div className="payment-section">
                <h3 className="payment-section-title">Select your bank</h3>
                <div className="netbanking-grid">
                  {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB", "Canara", "IndusInd", "Yes Bank"].map(b => (
                    <button
                      key={b}
                      className={`netbank-btn${bank === b ? " active" : ""}`}
                      onClick={() => setBank(b)}
                    >
                      🏦 {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet */}
            {payMethod === "wallet" && (
              <div className="payment-section">
                <h3 className="payment-section-title">Select wallet</h3>
                <div className="wallet-grid">
                  {["Paytm", "Amazon Pay", "Mobikwik", "Freecharge", "JioMoney"].map(w => (
                    <button
                      key={w}
                      className={`netbank-btn${wallet === w ? " active" : ""}`}
                      onClick={() => setWallet(w)}
                    >
                      👛 {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QR Payment */}
            {payMethod === "qr" && (
              <div className="payment-section">
                <h3 className="payment-section-title">
                  Scan & Pay
                </h3>

                <div
                  style={{
                    background: "#fff",
                    padding: 25,
                    borderRadius: 20,
                    textAlign: "center"
                  }}
                >
                  <QRCode value={qrData} size={220} />

                  <h3 style={{ marginTop: 20, color:"black" }}>
                    ₹{total}
                  </h3>

                  <p style={{color:"black" }} >Beauty Connect AI</p>

                  <p style={{color:"black" }}>
                    UPI ID:
                    <strong style={{color:"black" }}>
                      beautyconnectai@ybl
                    </strong>
                  </p>

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 20 }}
                    onClick={handlePay}
                  >
                    I've Completed Payment
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="payment-error">⚠️ {error}</div>
            )}

            {/* Pay button */}
            <button
              className="btn btn-primary payment-pay-btn"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? (
                <span className="payment-pay-loading">
                  <span className="payment-spinner" /> Processing payment…
                </span>
              ) : (
                `🔒 Pay ${formatPrice(total)} securely`
              )}
            </button>

            <p className="payment-secure-note">
              🔒 256-bit SSL encrypted · Your payment info is never stored
            </p>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="payment-summary-col">
            <div className="payment-summary-card">
              <h3 className="payment-section-title">Order summary</h3>

              {/* Salon info */}
              <div className="payment-salon-info">
                <img src={salon.image} alt={salon.name}
                  className="payment-salon-img" />
                <div>
                  <p className="payment-salon-name">{salon.name}</p>
                  <p className="payment-salon-area">📍 {salon.area}, Bangalore</p>
                </div>
              </div>

              <hr className="payment-divider" />

              {/* Booking details */}
              <div className="payment-detail-rows">
                {[
                  ["Service", service.name],
                  ["Duration", `${service.duration} min`],
                  ["Date", date],
                  ["Time", slot],
                ].map(([label, value]) => (
                  <div key={label} className="payment-detail-row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <hr className="payment-divider" />

              {/* Price breakdown */}
              <div className="payment-price-rows">
                <div className="payment-price-row">
                  <span>Service price</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="payment-price-row">
                  <span>GST (18%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <div className="payment-price-row">
                  <span>Convenience fee</span>
                  <span>{formatPrice(convenience)}</span>
                </div>
                <hr className="payment-divider" />
                <div className="payment-price-row payment-total-row">
                  <span>Total payable</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Offers */}
              <div className="payment-offer">
                <span className="payment-offer-icon">🎁</span>
                <div>
                  <p className="payment-offer-title">New user offer</p>
                  <p className="payment-offer-desc">Use code <strong>GLAMR100</strong> for ₹100 off your first booking</p>
                </div>
              </div>

              <div className="payment-trust-badges">
                <span>✅ Free cancellation</span>
                <span>✅ Instant confirmation</span>
                <span>✅ Secure payment</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
