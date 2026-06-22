import { useSearchParams } from "react-router-dom";
import { useSalonListController } from "../../controllers/SalonController";
import SalonCard from "../components/ui/SalonCard";
import Footer from "../components/layout/Footer";
import { AREAS, SERVICE_TAGS, SORT_OPTIONS } from "../../utils/constants";
import "./SalonListingPage.css";

function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export default function SalonListingPage() {
  const [params] = useSearchParams();
  const { salons, loading, filters, updateFilter } = useSalonListController({
    area: params.get("area") || "All areas",
    tag:  params.get("tag")  || "All",
    search: params.get("q") || "",
    sort: params.get("sort") || "rating",
  });

  return (
    <div className="page listing-page">
      <div className="listing-hero">
        <div className="container">
          <span className="section-eyebrow">📍 Bangalore</span>
          <h1>Beauty salons in Bangalore</h1>
          <p>Discover and book from the best salons across the city</p>
        </div>
      </div>
      <div className="container">
        <div className="filters-bar">
          <div className="filter-search-wrap">
            <span>🔍</span>
            <input className="filter-search-input" type="text" placeholder="Search salon, area or service…"
              value={filters.search} onChange={e => updateFilter("search", e.target.value)} />
          </div>
          <select className="form-control filter-select" value={filters.area} onChange={e => updateFilter("area", e.target.value)}>
            {AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
          <select className="form-control filter-select" value={filters.sort} onChange={e => updateFilter("sort", e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="tag-pills">
          {SERVICE_TAGS.map(t => (
            <button key={t} className={`tag-pill${filters.tag === t ? " active" : ""}`} onClick={() => updateFilter("tag", t)}>{t}</button>
          ))}
        </div>

        {!loading && (
          <p className="results-meta">
            Showing <strong>{salons.length}</strong> salon{salons.length !== 1 ? "s" : ""}
            {filters.area !== "All areas" && <> in <strong>{filters.area}</strong></>}
            {filters.tag !== "All" && <> · <strong>{filters.tag}</strong></>}
          </p>
        )}

        {loading ? (
          <div className="skeleton-grid">
            {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
          </div>
        ) : salons.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3>No salons found</h3>
            <p>Try a different area or service filter</p>
          </div>
        ) : (
          <div className="grid-3">{salons.map(s => <SalonCard key={s.id} salon={s} />)}</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
