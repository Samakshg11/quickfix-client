// src/hooks/useMechanicTracking.js
import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useGeolocation } from './useGeolocation';
import { useAuth } from '../context/AuthContext';

export const useMechanicTracking = (activeBookingId) => {
  const { socket }     = useSocket();
  const { isMechanic } = useAuth();
  const { location }   = useGeolocation({ watch: true, throttleMs: 4000 });

  useEffect(() => {
    if (!socket || !isMechanic || !location) return;
    socket.emit('location:update', {
      lat: location.lat,
      lng: location.lng,
      bookingId: activeBookingId || null,
    });
  }, [socket, isMechanic, location, activeBookingId]);

  return { location };
};
