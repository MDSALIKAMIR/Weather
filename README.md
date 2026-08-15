# Isobar — Premium Weather Platform

A production-ready weather dashboard built with **Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, and Recharts**, powered entirely by the free, key-less **Open-Meteo API** family (forecast, historical archive, geocoding, air quality). No mock data anywhere — every number on screen comes from a live API response.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm run start
```

Both `npx tsc --noEmit` and `npm run build` pass with zero TypeScript errors and zero ESLint warnings as of this build.

## What's implemented

- **Dashboard** (`/`) — current conditions, instrument-style data strip (lat/lon/pressure), next-24-hour scrollable timeline, today's summary, sunrise/sunset arc, air quality, derived weather alerts, temperature + rain charts, and a dynamically generated plain-language summary.
- **Forecast** (`/forecast`) — toggle between next 24 hours, 7 days, and 16 days; tap any day to expand its hourly breakdown.
- **Historical** (`/historical`) — date picker (back to 1940) against the Open-Meteo archive, with temperature/rain/humidity/wind charts and hover tooltips.
- **Compare** (`/compare`) — past vs. present vs. future timeline: pick any past date and any day in the current forecast window, see side-by-side cards and the temperature delta between them.
- **Favorites** (`/favorites`) — star any searched city; each favorite shows a live mini-preview (icon + temperature) and can be tapped to switch or removed.
- **Settings** (`/settings`) — °C/°F, dark/light theme, 12h/24h clock, ambient-animation toggle, default location, clear favorites — all persisted to `localStorage`.
- **Search & location** — debounced city search via the Open-Meteo Geocoding API, plus a "My location" button using the browser Geolocation API with graceful permission-denied / unavailable handling.
- **Dark/light mode**, responsive layout (sidebar on desktop, bottom nav on mobile), skeleton loaders for every async section, and friendly error states (no raw API errors shown to the user).

## What's simplified or omitted (for scope)

- Weather **alerts** are derived transparently from the same forecast values already shown (severe condition codes, high wind gusts, heavy precipitation, temperature extremes) since Open-Meteo's free tier doesn't expose an official alerts feed. No alert is invented — if nothing crosses a threshold, none is shown.
- **Air quality** degrades silently (the card simply doesn't render) if the Air Quality API is unreachable for a location, rather than showing placeholder data.
- The **weather-reactive background** (rain/snow/cloud/stars ambient layers + isobar contour motif) is intentionally restrained rather than a full animated scene, per the "don't be distracting" requirement.
- I could not verify live API calls from inside this sandboxed build environment (its outbound network allowlist doesn't include `open-meteo.com`) — the build, type-check, and all six routes were verified to compile and render, and the fetch logic follows Open-Meteo's documented response schema exactly, but you should do one live check after `npm run dev` to confirm your own network reaches Open-Meteo cleanly.

## Project structure

```
src/
  app/
    layout.tsx            Root layout — sidebar, header, mobile nav, providers
    page.tsx               Dashboard
    forecast/page.tsx      24h / 7-day / 16-day forecast
    historical/page.tsx    Historical weather + charts
    compare/page.tsx       Past / present / future comparison
    favorites/page.tsx     Saved locations
    settings/page.tsx      Preferences
    globals.css            Design tokens (Tailwind v4 @theme)
  components/
    layout/                Sidebar, MobileNav, Header
    weather/                CurrentWeatherCard, HourlyForecast, DailyForecastList,
                            TodaySummary, SunriseSunsetCard, AirQualityCard,
                            WeatherAlerts, WeatherSummary, WeatherBackground
    charts/                 TemperatureChart, RainChart, HumidityChart, WindChart
    search/                 LocationSearch
    ui/                     WeatherIcon, Skeletons, Toggles, ErrorState
  services/                 geocoding.ts, forecast.ts, historical.ts, airquality.ts
                            — the only files that call fetch()
  hooks/                    useForecast, useGeolocation, useDebouncedValue, useLocalStorage
  context/                  AppContext.tsx — theme, unit, active location, favorites, settings
  lib/                      weather-codes.ts (WMO code → condition/icon/mood), utils.ts
  types/                    weather.ts — all shared TypeScript interfaces
```

## Where the API integration lives

All network calls are isolated in `src/services/*.ts` — no component calls `fetch` directly:

- `geocoding.ts` → Open-Meteo Geocoding API (city search + a timezone-based reverse-lookup fallback for "My location")
- `forecast.ts` → Open-Meteo Forecast API (current + hourly + up to 16-day daily)
- `historical.ts` → Open-Meteo Archive API (any single date back to 1940)
- `airquality.ts` → Open-Meteo Air Quality API (current PM2.5, PM10, CO, NO₂, O₃, European AQI)

Each returns a typed shape from `src/types/weather.ts`, so every UI component works with clean TypeScript interfaces rather than raw API JSON.
