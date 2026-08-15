"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
  FavoriteLocation,
  GeoLocation,
  TemperatureUnit,
  ThemeMode,
  TimeFormat,
} from "@/types/weather";

const DEFAULT_LOCATION: GeoLocation = {
  id: 1264527,
  name: "Patna",
  latitude: 25.5941,
  longitude: 85.1376,
  country: "India",
  admin1: "Bihar",
  timezone: "Asia/Kolkata",
};

interface AppSettings {
  animationsEnabled: boolean;
}

interface AppContextValue {
  location: GeoLocation;
  setLocation: (loc: GeoLocation) => void;
  unit: TemperatureUnit;
  setUnit: (u: TemperatureUnit) => void;
  toggleUnit: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  timeFormat: TimeFormat;
  setTimeFormat: (f: TimeFormat) => void;
  favorites: FavoriteLocation[];
  addFavorite: (loc: GeoLocation) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
  defaultLocationId: number | null;
  setDefaultLocationId: (id: number | null) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useLocalStorage<GeoLocation>("weather:location", DEFAULT_LOCATION);
  const [unit, setUnitState] = useLocalStorage<TemperatureUnit>("weather:unit", "celsius");
  const [theme, setThemeState] = useLocalStorage<ThemeMode>("weather:theme", "dark");
  const [timeFormat, setTimeFormatState] = useLocalStorage<TimeFormat>("weather:timeFormat", "12h");
  const [favorites, setFavorites, favoritesHydrated] = useLocalStorage<FavoriteLocation[]>(
    "weather:favorites",
    []
  );
  const [defaultLocationId, setDefaultLocationId] = useLocalStorage<number | null>(
    "weather:defaultLocationId",
    null
  );
  const [settings, setSettings] = useLocalStorage<AppSettings>("weather:settings", {
    animationsEnabled: true,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (favoritesHydrated) setHydrated(true);
  }, [favoritesHydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setLocation = useCallback((loc: GeoLocation) => setLocationState(loc), [setLocationState]);
  const toggleUnit = useCallback(
    () => setUnitState((prev) => (prev === "celsius" ? "fahrenheit" : "celsius")),
    [setUnitState]
  );
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    [setThemeState]
  );

  const addFavorite = useCallback(
    (loc: GeoLocation) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.id === loc.id)) return prev;
        return [...prev, { ...loc, addedAt: Date.now() }];
      });
    },
    [setFavorites]
  );
  const removeFavorite = useCallback(
    (id: number) => setFavorites((prev) => prev.filter((f) => f.id !== id)),
    [setFavorites]
  );
  const isFavorite = useCallback((id: number) => favorites.some((f) => f.id === id), [favorites]);
  const clearFavorites = useCallback(() => setFavorites([]), [setFavorites]);

  const value = useMemo<AppContextValue>(
    () => ({
      location,
      setLocation,
      unit,
      setUnit: setUnitState,
      toggleUnit,
      theme,
      setTheme: setThemeState,
      toggleTheme,
      timeFormat,
      setTimeFormat: setTimeFormatState,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      clearFavorites,
      defaultLocationId,
      setDefaultLocationId,
      settings,
      setSettings,
      hydrated,
    }),
    [
      location,
      setLocation,
      unit,
      setUnitState,
      toggleUnit,
      theme,
      setThemeState,
      toggleTheme,
      timeFormat,
      setTimeFormatState,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      clearFavorites,
      defaultLocationId,
      setDefaultLocationId,
      settings,
      setSettings,
      hydrated,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
