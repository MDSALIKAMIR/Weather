import {
  WeatherApiError,
  type CurrentWeather,
  type DailyWeather,
  type ForecastResponse,
  type GeoLocation,
  type HourlyWeather,
} from "@/types/weather";

const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

const CURRENT_PARAMS =
  "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m,surface_pressure,cloud_cover,precipitation,is_day";

const HOURLY_PARAMS =
  "temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,uv_index,visibility";

const DAILY_PARAMS =
  "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max";

async function safeFetchJson(url: string) {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new WeatherApiError("Network error while fetching weather data.", "network");
  }
  if (res.status === 429) throw new WeatherApiError("Weather service rate limit reached. Try again shortly.", "rate-limit");
  if (!res.ok) throw new WeatherApiError("Weather data is unavailable right now.", "unknown");
  const data = await res.json();
  if (data.error) throw new WeatherApiError(data.reason ?? "Invalid weather request.", "invalid");
  return data;
}

export async function getForecast(
  location: GeoLocation,
  days = 16
): Promise<ForecastResponse> {
  const url =
    `${FORECAST_BASE}?latitude=${location.latitude}&longitude=${location.longitude}` +
    `&current=${CURRENT_PARAMS}&hourly=${HOURLY_PARAMS}&daily=${DAILY_PARAMS}` +
    `&forecast_days=${Math.min(days, 16)}&timezone=auto&wind_speed_unit=kmh`;

  const data = await safeFetchJson(url);

  const current: CurrentWeather = {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    humidity: data.current.relative_humidity_2m,
    pressure: data.current.surface_pressure,
    cloudCover: data.current.cloud_cover,
    precipitation: data.current.precipitation,
    isDay: data.current.is_day === 1,
  };

  const hourly: HourlyWeather = {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    apparentTemperature: data.hourly.apparent_temperature,
    precipitationProbability: data.hourly.precipitation_probability,
    precipitation: data.hourly.precipitation,
    weatherCode: data.hourly.weather_code,
    humidity: data.hourly.relative_humidity_2m,
    windSpeed: data.hourly.wind_speed_10m,
    windDirection: data.hourly.wind_direction_10m,
    pressure: data.hourly.surface_pressure,
    cloudCover: data.hourly.cloud_cover,
    uvIndex: data.hourly.uv_index,
    visibility: data.hourly.visibility,
  };

  const daily: DailyWeather = {
    time: data.daily.time,
    weatherCode: data.daily.weather_code,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    apparentTemperatureMax: data.daily.apparent_temperature_max,
    apparentTemperatureMin: data.daily.apparent_temperature_min,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    precipitationSum: data.daily.precipitation_sum,
    precipitationProbabilityMax: data.daily.precipitation_probability_max,
    windSpeedMax: data.daily.wind_speed_10m_max,
    windGustsMax: data.daily.wind_gusts_10m_max,
    windDirectionDominant: data.daily.wind_direction_10m_dominant,
    uvIndexMax: data.daily.uv_index_max,
  };

  return {
    location: { ...location, timezone: data.timezone ?? location.timezone },
    current,
    hourly,
    daily,
    units: {
      temperature: data.current_units?.temperature_2m ?? "°C",
      windSpeed: data.current_units?.wind_speed_10m ?? "km/h",
      precipitation: data.current_units?.precipitation ?? "mm",
    },
  };
}
