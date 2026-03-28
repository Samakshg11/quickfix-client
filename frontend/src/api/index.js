// src/api/booking.api.js
import client from './client';

export const createBookingAPI = (data) => client.post('/bookings', data);
export const getMyBookingsAPI = (params) => client.get('/bookings/my', { params });
export const getMechanicBookingsAPI = (params) => client.get('/bookings/mechanic', { params });
export const updateBookingStatusAPI = (id, status) => client.patch(`/bookings/${id}/status`, { status });
export const rateBookingAPI = (id, data) => client.patch(`/bookings/${id}/rate`, data);

// src/api/mechanic.api.js
import client from './client';

export const getNearbyMechanicsAPI = (params) => client.get('/mechanics/nearby', { params });
export const getMechanicProfileAPI = (id) => client.get(`/mechanics/${id}`);
export const updateMechanicProfileAPI = (data) => client.patch('/mechanics/me/profile', data);
export const updateMechanicLocationAPI = (data) => client.patch('/mechanics/me/location', data);

// src/api/chat.api.js
import client from './client';

export const getMessagesAPI = (roomId, params) => client.get(`/chat/${roomId}/messages`, { params });
export const sendMessageAPI = (roomId, data) => client.post(`/chat/${roomId}/messages`, data);
export const markReadAPI = (roomId) => client.patch(`/chat/${roomId}/read`);

// src/api/notification.api.js
import client from './client';

export const getNotificationsAPI = (params) => client.get('/notifications', { params });
export const markReadAPI = (id) => client.patch(`/notifications/${id}/read`);
export const markAllReadAPI = () => client.patch('/notifications/read-all');
