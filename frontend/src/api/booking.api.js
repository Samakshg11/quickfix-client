// src/api/booking.api.js
import client from './client';

export const createBookingAPI         = (data)         => client.post('/bookings', data);
export const getMyBookingsAPI         = (params)       => client.get('/bookings/my', { params });
export const getMechanicBookingsAPI   = (params)       => client.get('/bookings/mechanic', { params });
export const updateBookingStatusAPI   = (id, status)   => client.patch(`/bookings/${id}/status`, { status });
export const rateBookingAPI           = (id, data)     => client.patch(`/bookings/${id}/rate`, data);
