"use client";

import { useCallback, useState } from "react";

interface GeoState {
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ loading: false, error: null });

  const locate = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    setState({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        const message = "Location services aren't available in this browser.";
        setState({ loading: false, error: message });
        reject(new Error(message));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null });
          resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (err) => {
          const message =
            err.code === err.PERMISSION_DENIED
              ? "Location permission was denied. Enable it in your browser settings to use this."
              : err.code === err.POSITION_UNAVAILABLE
              ? "Your location could not be determined right now."
              : "Locating you took too long. Please try again.";
          setState({ loading: false, error: message });
          reject(new Error(message));
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
      );
    });
  }, []);

  return { locate, ...state };
}
