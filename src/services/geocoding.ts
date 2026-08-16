import type { GeoLocation } from "@/types/weather";

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=5&language=en&format=json`
  );

  if (!res.ok) {
    throw new Error("Failed to search locations");
  }

  const data = await res.json();
  return data.results || [];
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeoLocation> {
  try {
    // 1. BigDataCloud API - Fast reverse geocoding for exact city/town name
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (res.ok) {
      const data = await res.json();
      
      const cityName =
        data.city ||
        data.locality ||
        data.localityInfo?.informative?.[0]?.name ||
        data.principalSubdivision;

      if (cityName) {
        return {
          id: Math.floor(Math.abs(latitude * 1000 + longitude * 1000)),
          name: cityName,
          latitude,
          longitude,
          country: data.countryName || "",
          admin1: data.principalSubdivision || "",
        };
      }
    }
  } catch (e) {
    console.error("Reverse geocoding failed, falling back to coordinates", e);
  }

  // Fallback: If API fails, show formatted coordinates instead of generic "My Location"
  return {
    id: Date.now(),
    name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
  };
}