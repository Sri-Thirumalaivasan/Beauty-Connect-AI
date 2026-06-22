import { useState, useEffect } from "react";
import { fetchUserBookings } from "../../services/firebase/salonService";
import { useAuthController } from "../../controllers/AuthController";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user } = useAuthController();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    fetchUserBookings(user.uid)
      .then(data => {
        console.log("Dashboard bookings:", data);
        setBookings(data);
      })
      .catch(console.error);

  }, [user]);

  useEffect(() => {

    const favs =
      JSON.parse(
        localStorage.getItem("glamr_favourites")
      ) || [];

    setFavourites(favs);

  }, []);

  const upcomingBookings =
  bookings.filter(
    b => new Date(`${b.date} ${b.slot}`) >= new Date()
  );
  const historyBookings =
  bookings.filter(
    b => new Date(`${b.date} ${b.slot}`) < new Date()
  
  );

  const removeFavourite = (salonId) => {

    const updatedFavourites = favourites.filter(
      fav => fav.id !== salonId
    );
  
    setFavourites(updatedFavourites);
  
    localStorage.setItem(
      "glamr_favourites",
      JSON.stringify(updatedFavourites)
    );
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: "40px 0" }}>
        <h1>👋 Welcome Back, {user?.displayName?.split(" ")[0] || "there"}!</h1>
        <p>Your personal dashboard</p>
        <div className="dashboard-stats">

          <div className="stat-card">
            <h3>{upcomingBookings.length}</h3>
            <p>Upcoming Appointments</p>
          </div>

          <div className="stat-card">
            <h3>{historyBookings.length}</h3>
            <p>Past Appointments</p>
          </div>

          <div className="stat-card">
            <h3>{favourites.length}</h3>
            <p>Favourite Salons</p>
          </div>

        </div>

        <section className="dashboard-card">
          <h2>📅 Upcoming Appointments</h2>

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Salon</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.salonName}</td>
                    <td>{b.serviceName}</td>
                    <td>{b.date}</td>
                    <td>{b.slot}</td>
                    <td>
                      <span className="status-confirmed">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No upcoming appointments</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="dashboard-card">
          <h2>📋 Appointment History</h2>

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Salon</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {historyBookings.length > 0 ? (
                historyBookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.salonName}</td>
                    <td>{b.serviceName}</td>
                    <td>{b.date}</td>
                    <td>₹{b.servicePrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    No previous appointments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        <section className="dashboard-card">
          <h2>❤️ Favourite Salons</h2>

          <div className="favourites-grid">

            {favourites.length === 0 ? (
              <p>No favourite salons added yet.</p>
            ) : (
              favourites.map(salon => (
                <div className="fav-card" key={salon.id}>
            
                  <button
                    className="remove-fav-btn"
                    onClick={() => {
            
                      if (window.confirm("Remove from favourites?")) {
            
                        removeFavourite(salon.id);
            
                      }
            
                    }}
                  >
                    ✖
                  </button>
            
                  <img
                    src={salon.image}
                    alt={salon.name}
                  />
            
                  <h3>{salon.name}</h3>
            
                  <p>{salon.area}</p>
            
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/salons/${salon.id}`)}
                  >
                    View Salon
                  </button>
            
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}