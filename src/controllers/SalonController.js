/**
 * CONTROLLER — SalonController.js
 * Handles all salon-related business logic.
 */
import { useState, useEffect, useCallback } from "react";
import { fetchSalons, fetchSalonById, fetchReviews } from "../services/firebase/salonService";

export function useSalonListController(initialFilters = {}) {
  const [salons,  setSalons]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filters, setFilters] = useState({
    area:   initialFilters.area   || "All areas",
    tag:    initialFilters.tag    || "All",
    search: initialFilters.search || "",
    sort:   initialFilters.sort   || "rating",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSalons(filters);
      const sorted = [...data].sort((a, b) => {
        if (filters.sort === "reviews")   return b.reviewCount - a.reviewCount;
        if (filters.sort === "price-low") return (
          (a.services?.length ? Math.min(...a.services.map(s => s.price)) : 0) -
          (b.services?.length ? Math.min(...b.services.map(s => s.price)) : 0)
        );
        return b.rating - a.rating;   // default: rating
      });
      setSalons(sorted);
    } catch {
      setError("Failed to load salons. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Scroll to top of results when filter changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { salons, loading, error, filters, updateFilter, reload: load };
}

export function useSalonDetailController(salonId) {
  const [salon,   setSalon]   = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!salonId) return;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    Promise.all([fetchSalonById(salonId), fetchReviews(salonId)])
      .then(([s, r]) => { setSalon(s); setReviews(r); })
      .catch(() => setError("Could not load salon details."))
      .finally(() => setLoading(false));
  }, [salonId]);

  return { salon, reviews, loading, error };
}

export function useHomeSalonsController() {
  const [featured, setFeatured] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetchSalons()
      .then(data => {
        setFeatured(data.slice(0, 3));
        setTopRated([...data].sort((a, b) => b.rating - a.rating).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return { featured, topRated, loading };
}
