// src/hooks/useBookings.js
import { useState, useCallback } from 'react';
import { getMyBookingsAPI, getMechanicBookingsAPI, updateBookingStatusAPI, rateBookingAPI } from '../api/booking.api';
import toast from 'react-hot-toast';

export const useBookings = (role = 'user') => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);

  const fetch = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const api = role === 'mechanic' ? getMechanicBookingsAPI : getMyBookingsAPI;
      const res = await api(params);
      setBookings(res.data.data);
    } catch (err) {
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [role]);

  const updateStatus = useCallback(async (bookingId, status) => {
    const res = await updateBookingStatusAPI(bookingId, status);
    setBookings((prev) => prev.map((b) => b._id === bookingId ? res.data.data : b));
    toast.success(`Booking ${status}.`);
    return res.data.data;
  }, []);

  const rate = useCallback(async (bookingId, rating, review) => {
    const res = await rateBookingAPI(bookingId, { rating, review });
    setBookings((prev) => prev.map((b) => b._id === bookingId ? res.data.data : b));
    toast.success('Rating submitted!');
  }, []);

  return { bookings, loading, fetch, updateStatus, rate };
};
