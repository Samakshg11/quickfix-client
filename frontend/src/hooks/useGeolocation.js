// src/hooks/useGeolocation.js
import { useState, useEffect, useRef } from 'react';

export const useGeolocation = ({ watch = false, throttleMs = 5000 } = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.');
      setLoading(false);
      return;
    }

    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 };

    const onSuccess = (pos) => {
      const now = Date.now();
      if (watch && now - lastEmitRef.current < throttleMs) return;
      lastEmitRef.current = now;

      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      setLoading(false);
    };

    const onError = (err) => {
      setError(err.message);
      setLoading(false);
    };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, [watch, throttleMs]);

  return { location, error, loading };
};
