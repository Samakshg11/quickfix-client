// src/api/notification.api.js
import client from './client';

export const getNotificationsAPI = (params) => client.get('/notifications', { params });
export const markReadAPI         = (id)      => client.patch(`/notifications/${id}/read`);
export const markAllReadAPI      = ()         => client.patch('/notifications/read-all');
