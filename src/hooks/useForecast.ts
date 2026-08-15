"use client";

import { useEffect, useState } from "react";
import { getForecast } from "@/services/forecast";
import { WeatherApiError, type ForecastResponse, type GeoLocation } from "@/types/weather";

export function useForecast(location: GeoLocation) {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getForecast(location)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof WeatherApiError ? err.message : "Couldn't load weather data.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude]);

  return { data, loading, error };
}
