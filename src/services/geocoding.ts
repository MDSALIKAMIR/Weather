import { WeatherApiError, type GeoLocation } from "@/types/weather";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1";

interface RawGeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone: string;
  population?: number;
}

function mapResult(r: RawGeoResult): GeoLocation {
  return {
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country ?? "",
    countryCode: r.country_code,
    admin1: r.admin1,
    timezone: r.timezone,
    population: r.population,
  };
}

export async function searchLocations(query: string, count = 8): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  try {
    const url = `${GEOCODING_BASE}/search?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new WeatherApiError("Location search failed", "network");
    const data = await res.json();
    const results: RawGeoResult[] = data.results ?? [];
    return results.map(mapResult);
  } catch (err) {
    if (err instanceof WeatherApiError) throw err;
    throw new WeatherApiError("Could not reach the location search service.", "network");
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation> {
  // Open-Meteo's geocoding API has no reverse endpoint, so we ask the
  // forecast API for timezone context and label the point by its region
  // as a graceful fallback when no named match is available.
  try {
    const tzRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`
    );
    const tzData = await tzRes.json();
    return {
      id: Math.round(lat * 1000) + Math.round(lon * 1000),
      name: tzData.timezone?.split("/").pop()?.replace(/_/g, " ") ?? "My Location",
      latitude: lat,
      longitude: lon,
      country: "",
      timezone: tzData.timezone ?? "auto",
    };
  } catch {
    return {
      id: Math.round(lat * 1000) + Math.round(lon * 1000),
      name: "My Location",
      latitude: lat,
      longitude: lon,
      country: "",
      timezone: "auto",
    };
  }
}
