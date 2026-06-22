import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";
import Footer from "../components/layout/Footer";
import { CONTACT_INFO } from "../../utils/constants";
import "./ContactPage.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General enquiry", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, "contact_messages"), {
        ...form,
        createdAt: serverTimestamp(),
        status: "Pending",
      });

      setSubmittedName(form.name);
      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        subject: "General enquiry",
        message: "",
      });
    } catch (err) {
      console.log(err);
      console.log(err.code);
      console.log(err.message);
    
      setError(err.code + " : " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page contact-page page-enter">
      <div className="contact-hero">
        <div className="container">
          <span className="section-eyebrow">📞 Get in touch</span>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-sub">We'd love to hear from you. Send us a message or reach us directly.</p>
        </div>
      </div>

      <div className="container contact-body">
        <div className="contact-grid">
          {/* Form */}
          <div className="contact-form-wrap">
            <h2>Send a message</h2>

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">✅</div>
                <h3>Message sent!</h3>
                <p>
                  Thanks for reaching out, <strong>{submittedName}</strong>.
                  We'll get back to you within 24 hours.
                </p>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 20 }}
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {error && <div className="contact-error">⚠️ {error}</div>}
                <div className="form-group">
                  <label>Full name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>

                  <div className="select-wrapper">
                    <select
                      className="form-control subject-select"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                    >
                      <option value="General enquiry">General enquiry</option>
                      <option value="Booking issue">Booking issue</option>
                      <option value="List my salon">List my salon</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Press & media">Press & media</option>
                    </select>

                    <span className="select-arrow">⌄</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    name="message"
                    placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send message →"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-info-col">
            <h2>Find us</h2>
            <div className="contact-info-cards">
              {[
                { icon: "📍", label: "Address", value: CONTACT_INFO.address },
                { icon: "📞", label: "Phone", value: CONTACT_INFO.phone },
                { icon: "✉️", label: "Email", value: CONTACT_INFO.email },
                { icon: "🕐", label: "Business hours", value: "Mon – Sat: 9 AM – 9 PM\nSunday: 10 AM – 6 PM" },
              ].map((item, i) => (
                <div key={i} className="contact-info-card">
                  <span className="contact-info-icon">{item.icon}</span>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    <p className="contact-info-value" style={{ whiteSpace: "pre-line" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-faq">
              <h3>Quick answers</h3>
              {[
                ["How do I list my salon?", "Email us at " + CONTACT_INFO.email + " with your salon details."],
                ["Can I cancel a booking?", "Yes, free cancellation up to 2 hours before your appointment."],
                ["Is the app free to use?", "Absolutely — Glamr is free for customers. Salons pay a small listing fee."],
              ].map(([q, a], i) => (
                <details key={i} className="faq-item">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
