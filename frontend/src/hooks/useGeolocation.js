// src/hooks/useGeolocation.js
import { useState, useEffect, useRef } from 'react';

export const useGeolocation = ({ watch = false, throttleMs = 5000 } = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [attempt, setAttempt]   = useState(0);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.');
      setLoading(false);
      return;
    }

    if (!window.isSecureContext) {
      setError('Location works only in a secure context. Use localhost or HTTPS.');
      setLoading(false);
      return;
    }

    const onSuccess = (pos) => {
      const now = Date.now();
      if (watch && now - lastEmitRef.current < throttleMs) return;
      lastEmitRef.current = now;

      setError(null);
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      setLoading(false);
    };

    const onError = (err) => {
      const codeMap = {
        1: 'Location permission was denied.',
        2: 'Unable to determine your current location. Try moving near a window or switching networks.',
        3: 'Location request timed out. Try again in a few seconds.',
      };
      setError(codeMap[err.code] || err.message || 'Unable to fetch location.');
      setLoading(false);
    };

    const highAccuracyOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    const fallbackOptions = { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, fallbackOptions);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (err) => {
          if (err.code === 2 || err.code === 3) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, fallbackOptions);
            return;
          }
          onError(err);
        },
        highAccuracyOptions
      );
    }
  }, [watch, throttleMs, attempt]);

  return { location, error, loading, retry: () => setAttempt((n) => n + 1) };
};
