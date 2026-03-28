// src/api/auth.api.js
import client from './client';

export const loginAPI = (data) => client.post('/auth/login', data);
export const registerAPI = (data) => client.post('/auth/register', data);
export const registerMechanicAPI = (data) => client.post('/auth/register/mechanic', data);
export const getMeAPI = () => client.get('/auth/me');
export const updateProfileAPI = (data) => client.patch('/users/me', data);
