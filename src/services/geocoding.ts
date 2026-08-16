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
    // Precise GPS Reverse Geocoding
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (res.ok) {
      const data = await res.json();

      // Madhubani jise districts/locality me accurate name pick karein
      const cityName =
        data.locality ||
        data.city ||
        data.principalSubdivisionCode?.split("-")[1] ||
        data.principalSubdivision;

      if (cityName) {
        return {
          id: Math.floor(Math.abs(latitude * 1000 + longitude * 1000)),
          name: cityName,
          latitude,
          longitude,
          country: data.countryName || "India",
          admin1: data.principalSubdivision || "Bihar",
        };
      }
    }
  } catch (e) {
    console.error("Reverse geocoding error:", e);
  }

  return {
    id: Date.now(),
    name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
  };
}