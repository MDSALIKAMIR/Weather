// Core domain types for the weather platform.
// All shapes are derived from Open-Meteo API responses (no fields invented).

export type TemperatureUnit = "celsius" | "fahrenheit";
export type ThemeMode = "dark" | "light";
export type TimeFormat = "24h" | "12h";

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode?: string;
  admin1?: string; // state / region
  timezone: string;
  population?: number;
}

export interface FavoriteLocation extends GeoLocation {
  addedAt: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  isDay: boolean;
  visibility?: number;
  uvIndex?: number;
}

export interface HourlyWeather {
  time: string[];
  temperature: number[];
  apparentTemperature: number[];
  precipitationProbability: number[];
  precipitation: number[];
  weatherCode: number[];
  humidity: number[];
  windSpeed: number[];
  windDirection: number[];
  pressure: number[];
  cloudCover: number[];
  uvIndex: number[];
  visibility: number[];
}

export interface DailyWeather {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  windSpeedMax: number[];
  windGustsMax: number[];
  windDirectionDominant: number[];
  uvIndexMax: number[];
}

export interface ForecastResponse {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  units: {
    temperature: string;
    windSpeed: string;
    precipitation: string;
  };
}

export interface HistoricalResponse {
  location: GeoLocation;
  date: string;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface AirQualityData {
  time: string[];
  pm2_5: number[];
  pm10: number[];
  carbonMonoxide: number[];
  nitrogenDioxide: number[];
  ozone: number[];
  europeanAqi: number[];
}

export interface WeatherCondition {
  label: string;
  group: "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "thunderstorm";
  severity: "none" | "minor" | "moderate" | "severe";
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: "minor" | "moderate" | "severe";
}

export class WeatherApiError extends Error {
  constructor(message: string, public kind: "network" | "not-found" | "invalid" | "rate-limit" | "unknown" = "unknown") {
    super(message);
    this.name = "WeatherApiError";
  }
}
