// src/api/chat.api.js
import client from './client';

export const getMessagesAPI = (roomId, params) => client.get(`/chat/${roomId}/messages`, { params });
export const sendMessageAPI = (roomId, data)   => client.post(`/chat/${roomId}/messages`, data);
export const markReadAPI    = (roomId)          => client.patch(`/chat/${roomId}/read`);
