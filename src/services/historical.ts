import {
  WeatherApiError,
  type DailyWeather,
  type GeoLocation,
  type HistoricalResponse,
  type HourlyWeather,
} from "@/types/weather";

const ARCHIVE_BASE = "https://archive-api.open-meteo.com/v1/archive";

const HOURLY_PARAMS =
  "temperature_2m,apparent_temperature,precipitation,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover";

const DAILY_PARAMS =
  "weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant";

export async function getHistoricalWeather(
  location: GeoLocation,
  date: string
): Promise<HistoricalResponse> {
  const url =
    `${ARCHIVE_BASE}?latitude=${location.latitude}&longitude=${location.longitude}` +
    `&start_date=${date}&end_date=${date}&hourly=${HOURLY_PARAMS}&daily=${DAILY_PARAMS}` +
    `&timezone=auto&wind_speed_unit=kmh`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new WeatherApiError("Network error while fetching historical weather.", "network");
  }
  if (!res.ok) throw new WeatherApiError("Historical data is unavailable for this date.", "not-found");
  const data = await res.json();
  if (data.error) throw new WeatherApiError(data.reason ?? "Invalid historical request.", "invalid");

  if (!data.hourly?.time?.length) {
    throw new WeatherApiError("No historical data found for this date and location.", "not-found");
  }

  const hourly: HourlyWeather = {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    apparentTemperature: data.hourly.apparent_temperature,
    precipitationProbability: [],
    precipitation: data.hourly.precipitation,
    weatherCode: data.hourly.weather_code,
    humidity: data.hourly.relative_humidity_2m,
    windSpeed: data.hourly.wind_speed_10m,
    windDirection: data.hourly.wind_direction_10m,
    pressure: data.hourly.surface_pressure,
    cloudCover: data.hourly.cloud_cover,
    uvIndex: [],
    visibility: [],
  };

  const daily: DailyWeather = {
    time: data.daily.time,
    weatherCode: data.daily.weather_code,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    apparentTemperatureMax: [],
    apparentTemperatureMin: [],
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    precipitationSum: data.daily.precipitation_sum,
    precipitationProbabilityMax: [],
    windSpeedMax: data.daily.wind_speed_10m_max,
    windGustsMax: [],
    windDirectionDominant: data.daily.wind_direction_10m_dominant,
    uvIndexMax: [],
  };

  return {
    location: { ...location, timezone: data.timezone ?? location.timezone },
    date,
    hourly,
    daily,
  };
}
