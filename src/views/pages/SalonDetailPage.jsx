import { useParams, useNavigate, Link } from "react-router-dom";
import { useSalonDetailController } from "../../controllers/SalonController";
import { useBookingFormController } from "../../controllers/BookingController";
import { useAuthController } from "../../controllers/AuthController";
import { getStarString } from "../../models/SalonModel";
import { formatPrice } from "../../utils/helpers";
import { TIME_SLOTS } from "../../utils/constants";
import Spinner from "../components/common/Spinner";
import Toast from "../components/common/Toast";
import Footer from "../components/layout/Footer";
import { useState, useEffect } from "react";
import { saveReview, fetchReviews } from "../../services/firebase/salonService";
import "./SalonDetailPage.css";

export default function SalonDetailPage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthController();

  const {
    salon,
    reviews,
    loading,
    error: loadError
  } = useSalonDetailController(id);

  console.log("Reviews in component:", reviews);

  const booking = useBookingFormController(salon, user);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [localReviews, setLocalReviews] = useState([]);
  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const submitReview = async () => {

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please enter review");
      return;
    }

    await saveReview({
      salonId: salon.id,
      userId: user.uid,
      userName: user.displayName || user.email,
      rating,
      text: reviewText,
      date: new Date().toLocaleDateString()
    });

    const updatedReviews = await fetchReviews(id);

    console.log(updatedReviews);

    setLocalReviews(updatedReviews);

    setReviewText("");
    setShowReviewForm(false);


  };

  const handleBook = () => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (
      !booking.selectedService ||
      !booking.bookingDate ||
      !booking.selectedSlot
    ) {
      alert("Please select service, date and time slot.");
      return;
    }

    const now = new Date();

    const selectedDate = booking.bookingDate;

    // Convert 10:00 AM → Date object
    const slotDateTime = new Date(
      `${selectedDate} ${booking.selectedSlot}`
    );

    if (slotDateTime <= now) {
      alert("Selected slot has already passed. Please choose another slot.");
      return;
    }

    navigate("/payment", {
      state: {
        salon,
        service: booking.selectedService,
        date: booking.bookingDate,
        slot: booking.selectedSlot
      }
    });
  };

  if (loading)
    return (
      <div className="page">
        <Spinner />
      </div>
    );

  if (loadError || !salon)
    return (
      <div className="page">
        <h2>Salon not found</h2>
      </div>
    );

  return (<div className="page detail-page">

    <Toast message={booking.error} type="error" />

    <div className="detail-hero">
      <img src={salon.image} alt={salon.name} />
      <div className="detail-hero-overlay" />
      <div className="detail-hero-text container">
        <h1>{salon.name}</h1>
      </div>
    </div>

    <div className="container">

      <Link to="/salons" className="detail-back">
        ← Back to salons
      </Link>

      <div className="detail-body">

        <div>

          {/* META */}
          <div className="detail-section">

            <div className="detail-rating">
              <span className="stars">
                {getStarString(salon.rating)}
              </span>

              <span>
                {salon.rating}
              </span>

            </div>

            <p>{salon.about}</p>

          </div>


          {/* GALLERY */}
          <div className="detail-section">

            <h2>Gallery</h2>

            <div className="gallery-strip">

              {salon.gallery?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  loading="lazy"
                />
              ))}

            </div>

          </div>


          {/* SERVICES */}

          <div className="detail-section">

            <h2>Services & Pricing</h2>

            <div className="services-list">

              {salon.services.map(svc => (
                <button
                  key={svc.id}
                  className={`service-row ${booking.selectedService?.id === svc.id
                    ? "selected"
                    : ""
                    }`}
                  onClick={() => booking.selectService(svc)}
                >

                  <div>

                    <span>{svc.name}</span>

                    <span>
                      ⏱ {svc.duration} min
                    </span>

                  </div>

                  <span>
                    {formatPrice(svc.price)}
                  </span>

                </button>
              ))}

            </div>

          </div>
          {/* REVIEWS */}

          <div className="detail-section">

            <h2>Customer Reviews</h2>

            {
              reviews.length === 0
                ?
                <p>No reviews yet.</p>
                :
                <div
                  style={{
                    background: "#fff",
                    padding: 20,
                    border: "2px solid red"
                  }}
                >

                  {reviews.map(r => (
                    <div
                      key={r.id}
                      style={{
                        border: "1px solid black",
                        marginBottom: 20,
                        padding: 15
                      }}
                    >

                      <div className="review-top">

                        <span>
                          {r.userName || r.user}
                        </span>

                        <span>
                          {"★".repeat(r.rating)}
                        </span>

                        <span>
                          {
                            r.date ||
                            r.createdAt?.toDate?.()?.toLocaleDateString()
                          }
                        </span>

                      </div>

                      <p>
                        {r.text}
                      </p>

                    </div>
                  ))}

                </div>
            }

            <button
              className="btn btn-primary"
              onClick={() => setShowReviewForm(true)}
            >
              ⭐ Write Review
            </button>

            {
              showReviewForm && (

                <div className="review-form-card">

                  <select
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >

                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                    <option value={3}>⭐⭐⭐</option>
                    <option value={2}>⭐⭐</option>
                    <option value={1}>⭐</option>

                  </select>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={submitReview}
                  >
                    Submit Review
                  </button>

                </div>
              )

            }

          </div>

        </div>


        {/* BOOKING PANEL */}

        <aside className="booking-panel">
          <h2 className="booking-panel-title">
            Book appointment
          </h2>

          <hr className="booking-divider" />

          {booking.selectedService ? (
            <div className="booking-selected-svc">
              <span>{booking.selectedService.name}</span>

              <span className="svc-price">
                {formatPrice(booking.selectedService.price)}
              </span>
            </div>
          ) : (
            <p className="booking-hint">
              ← Select a service first
            </p>
          )}

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              className="form-control"
              value={booking.bookingDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                booking.setBookingDate(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Time Slot</label>

            <div className="time-slots">
              {TIME_SLOTS.map(slot => {

                const slotDateTime = new Date(
                  `${booking.bookingDate || new Date().toISOString().split("T")[0]} ${slot}`
                );

                const isPast = slotDateTime <= new Date();

                return (
                  <button
                    key={slot}
                    disabled={isPast}
                    className={`time-slot ${booking.selectedSlot === slot ? "active" : ""
                      } ${isPast ? "disabled-slot" : ""}`}
                    onClick={() => booking.setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="btn btn-primary booking-btn"
            onClick={handleBook}
            disabled={
              !booking.selectedService ||
              !booking.bookingDate ||
              !booking.selectedSlot
            }
          >
            {user
              ? "Proceed to payment →"
              : "Sign in to book"}
          </button>

          <p className="booking-note">
            ✓ Free cancellation up to 2 hours before
          </p>
        </aside>

      </div>

    </div>

    <Footer />

  </div>

  );
}