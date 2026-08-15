import { WeatherApiError, type AirQualityData, type GeoLocation } from "@/types/weather";

const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function getAirQuality(location: GeoLocation): Promise<AirQualityData | null> {
  try {
    const url =
      `${AIR_QUALITY_BASE}?latitude=${location.latitude}&longitude=${location.longitude}` +
      `&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.current) return null;

    return {
      time: [data.current.time],
      pm2_5: [data.current.pm2_5],
      pm10: [data.current.pm10],
      carbonMonoxide: [data.current.carbon_monoxide],
      nitrogenDioxide: [data.current.nitrogen_dioxide],
      ozone: [data.current.ozone],
      europeanAqi: [data.current.european_aqi],
    };
  } catch {
    // Air quality is a modular enhancement — feature degrades gracefully.
    return null;
  }
}

export function aqiLabel(aqi: number): { label: string; tone: "good" | "moderate" | "poor" | "severe" } {
  if (aqi <= 20) return { label: "Good", tone: "good" };
  if (aqi <= 40) return { label: "Fair", tone: "good" };
  if (aqi <= 60) return { label: "Moderate", tone: "moderate" };
  if (aqi <= 80) return { label: "Poor", tone: "poor" };
  if (aqi <= 100) return { label: "Very Poor", tone: "poor" };
  return { label: "Extremely Poor", tone: "severe" };
}

export class AirQualityError extends WeatherApiError {}
