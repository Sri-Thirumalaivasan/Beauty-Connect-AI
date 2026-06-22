import { Link } from "react-router-dom";
import { getSalonDisplayName } from "../../../models/SalonModel";
import { formatPrice } from "../../../utils/helpers";
import "./SalonCard.css";

const addToFavorites = (salon) => {

  let favs =
    JSON.parse(
      localStorage.getItem("glamr_favourites")
    ) || [];

  if (favs.some(x => x.id === salon.id)) {
    alert("Already in favourites ❤️");
    return;
  }

  const favouriteSalon = {
    id: salon.id,
    name: salon.name,
    image: salon.image,
    area: salon.area,
    rating: salon.rating
  };

  favs.push(favouriteSalon);

  localStorage.setItem(
    "glamr_favourites",
    JSON.stringify(favs)
  );

  alert("Added to favourites ❤️");
};

export default function SalonCard({ salon }) {
  const minPrice = salon.services.length ? Math.min(...salon.services.map(s => s.price)) : 0;
  const previewServices = salon.services.slice(0, 3);
  const moreCount = salon.services.length - 3;

  return (
    <Link to={`/salons/${salon.id}`} className="salon-card">
      <div className="salon-card-img-wrap">

        <img
          src={salon.image}
          alt={salon.name}
          loading="lazy"
          onError={(e) => {
            console.log("Image failed:", salon.name, salon.image);
            e.target.style.border = "3px solid red";
          }}
        />

        <button
          className="favorite-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToFavorites(salon);
          }}
        >
          ❤️
        </button>

        <span className={`sc-status ${salon.openNow ? "open" : "closed"}`}>
          {salon.openNow ? "● Open" : "● Closed"}
        </span>

      </div>

      <div className="salon-card-body">
        <h3 className="sc-name">{getSalonDisplayName(salon)}</h3>
        <div className="sc-area">
          <span className="sc-area-dot" />
          {salon.area}, Bangalore
        </div>
        <div className="sc-tags">
          {salon.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        {/* Service chips preview */}
        <div className="sc-services">
          {previewServices.map(s => (
            <span key={s.id} className="sc-service-chip">{s.name}</span>
          ))}
          {moreCount > 0 && <span className="sc-service-more">+{moreCount} more</span>}
        </div>

        {minPrice > 0 && <p className="sc-from">From {formatPrice(minPrice)}</p>}
        <button className="sc-book-btn">Book appointment →</button>
      </div>
    </Link>
  );
}
