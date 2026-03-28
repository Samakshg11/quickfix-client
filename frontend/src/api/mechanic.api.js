// src/api/mechanic.api.js
import client from './client';

export const getNearbyMechanicsAPI    = (params)   => client.get('/mechanics/nearby', { params });
export const getMechanicProfileAPI    = (id)        => client.get(`/mechanics/${id}`);
export const updateMechanicProfileAPI = (data)      => client.patch('/mechanics/me/profile', data);
export const updateMechanicLocationAPI = (data)     => client.patch('/mechanics/me/location', data);
