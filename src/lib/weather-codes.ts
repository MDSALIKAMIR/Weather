import type { WeatherCondition } from "@/types/weather";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

// Open-Meteo uses WMO Weather interpretation codes (WW).
// https://open-meteo.com/en/docs — "Weather variable documentation"
const CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: "Clear sky", group: "clear", severity: "none" },
  1: { label: "Mainly clear", group: "clear", severity: "none" },
  2: { label: "Partly cloudy", group: "cloudy", severity: "none" },
  3: { label: "Overcast", group: "cloudy", severity: "none" },
  45: { label: "Fog", group: "fog", severity: "minor" },
  48: { label: "Depositing rime fog", group: "fog", severity: "minor" },
  51: { label: "Light drizzle", group: "drizzle", severity: "none" },
  53: { label: "Moderate drizzle", group: "drizzle", severity: "minor" },
  55: { label: "Dense drizzle", group: "drizzle", severity: "minor" },
  56: { label: "Light freezing drizzle", group: "drizzle", severity: "minor" },
  57: { label: "Dense freezing drizzle", group: "drizzle", severity: "moderate" },
  61: { label: "Slight rain", group: "rain", severity: "none" },
  63: { label: "Moderate rain", group: "rain", severity: "minor" },
  65: { label: "Heavy rain", group: "rain", severity: "severe" },
  66: { label: "Light freezing rain", group: "rain", severity: "moderate" },
  67: { label: "Heavy freezing rain", group: "rain", severity: "severe" },
  71: { label: "Slight snow fall", group: "snow", severity: "none" },
  73: { label: "Moderate snow fall", group: "snow", severity: "minor" },
  75: { label: "Heavy snow fall", group: "snow", severity: "severe" },
  77: { label: "Snow grains", group: "snow", severity: "minor" },
  80: { label: "Slight rain showers", group: "rain", severity: "none" },
  81: { label: "Moderate rain showers", group: "rain", severity: "minor" },
  82: { label: "Violent rain showers", group: "rain", severity: "severe" },
  85: { label: "Slight snow showers", group: "snow", severity: "minor" },
  86: { label: "Heavy snow showers", group: "snow", severity: "severe" },
  95: { label: "Thunderstorm", group: "thunderstorm", severity: "severe" },
  96: { label: "Thunderstorm with slight hail", group: "thunderstorm", severity: "severe" },
  99: { label: "Thunderstorm with heavy hail", group: "thunderstorm", severity: "severe" },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return CONDITIONS[code] ?? { label: "Unknown", group: "cloudy", severity: "none" };
}

export function getWeatherIcon(code: number, isDay = true): LucideIcon {
  const condition = getWeatherCondition(code);
  switch (condition.group) {
    case "clear":
      return isDay ? Sun : Moon;
    case "cloudy":
      return code === 2 ? (isDay ? CloudSun : CloudMoon) : code === 3 ? Cloudy : Cloud;
    case "fog":
      return CloudFog;
    case "drizzle":
      return CloudDrizzle;
    case "rain":
      return condition.severity === "severe" ? CloudRainWind : CloudRain;
    case "snow":
      return CloudSnow;
    case "thunderstorm":
      return CloudLightning;
    default:
      return Cloud;
  }
}

/** Background "mood" used by WeatherBackground to pick an ambient scene. */
export type WeatherMood = "clear-day" | "clear-night" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export function getWeatherMood(code: number, isDay: boolean): WeatherMood {
  const condition = getWeatherCondition(code);
  switch (condition.group) {
    case "clear":
      return isDay ? "clear-day" : "clear-night";
    case "cloudy":
      return "cloudy";
    case "fog":
      return "fog";
    case "drizzle":
    case "rain":
      return "rain";
    case "snow":
      return "snow";
    case "thunderstorm":
      return "storm";
    default:
      return "cloudy";
  }
}
