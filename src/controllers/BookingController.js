/**
 * CONTROLLER — BookingController.js
 * Manages booking flow business logic.
 * Validates inputs, calls salonService, returns state to Views.
 */
import { useState, useCallback, useEffect } from "react";
import { saveBooking, fetchUserBookings, fetchAllBookings } from "../services/firebase/salonService";

export function useBookingFormController(salon, user) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot,    setSelectedSlot]    = useState("");
  const [bookingDate,     setBookingDate]      = useState("");
  const [loading,         setLoading]          = useState(false);
  const [error,           setError]            = useState(null);

  const selectService = useCallback((svc) => {
    setSelectedService(prev => prev?.id === svc.id ? null : svc);
    setError(null);
  }, []);

  const submitBooking = useCallback(async () => {
    if (!selectedService) { setError("Please select a service."); return null; }
    if (!bookingDate)      { setError("Please choose a date.");    return null; }
    if (!selectedSlot)     { setError("Please pick a time slot."); return null; }
    if (!user)             { setError("Please sign in to book.");  return null; }
    setError(null);
    setLoading(true);
    try {
      return await saveBooking({
        salonId: salon.id, salonName: salon.name, salonArea: salon.area,
        serviceId: selectedService.id, serviceName: selectedService.name,
        servicePrice: selectedService.price,
        date: bookingDate, slot: selectedSlot,
        userId: user.uid, userName: user.displayName, userEmail: user.email,
      });
    } catch {
      setError("Booking failed. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [salon, user, selectedService, bookingDate, selectedSlot]);

  return { selectedService, selectedSlot, bookingDate, loading, error,
    selectService, setSelectedSlot, setBookingDate, submitBooking,
    clearError: () => setError(null) };
}

export function useUserBookingsController(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchUserBookings(userId).then(setBookings).finally(() => setLoading(false));
  }, [userId]);
  return { bookings, loading };
}

export function useAdminBookingsController() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  useEffect(() => {
    fetchAllBookings().then(setBookings).finally(() => setLoading(false));
  }, []);
  return { bookings, loading };
}
