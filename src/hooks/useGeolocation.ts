"use client";

import { useCallback, useState } from "react";

interface GeoState {
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    loading: false,
    error: null,
  });

  const locate = useCallback(
    (): Promise<{ latitude: number; longitude: number }> => {
      setState({
        loading: true,
        error: null,
      });

      return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !("geolocation" in navigator)) {
          const message =
            "Location services aren't available in this browser.";

          setState({
            loading: false,
            error: message,
          });

          reject(new Error(message));
          return;
        }

        if (!window.isSecureContext) {
          const message =
            "Location requires a secure HTTPS connection.";

          setState({
            loading: false,
            error: message,
          });

          reject(new Error(message));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            if (
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude)
            ) {
              const message =
                "Your browser returned an invalid location.";

              setState({
                loading: false,
                error: message,
              });

              reject(new Error(message));
              return;
            }

            setState({
              loading: false,
              error: null,
            });

            resolve({
              latitude,
              longitude,
            });
          },

          (err) => {
            const message =
              err.code === err.PERMISSION_DENIED
                ? "Location permission was denied. Allow location access for this site and try again."
                : err.code === err.POSITION_UNAVAILABLE
                ? "Your current location could not be determined. Turn on GPS/location services and try again."
                : "Getting your location took too long. Turn on GPS/location services and try again.";

            setState({
              loading: false,
              error: message,
            });

            reject(new Error(message));
          },

          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 60 * 1000,
          }
        );
      });
    },
    []
  );

  return {
    locate,
    ...state,
  };
}