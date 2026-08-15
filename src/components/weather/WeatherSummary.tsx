import { getWeatherCondition } from "@/lib/weather-codes";
import type { CurrentWeather, DailyWeather, HourlyWeather } from "@/types/weather";

/** Builds a plain-language summary strictly from live values already fetched. */
export function buildWeatherSummary(current: CurrentWeather, daily: DailyWeather, hourly: HourlyWeather): string {
  const condition = getWeatherCondition(current.weatherCode).label.toLowerCase();
  const high = Math.round(daily.temperatureMax[0]);
  const rainChance = daily.precipitationProbabilityMax[0] ?? 0;

  const now = Date.now();
  const startIdx = Math.max(
    0,
    hourly.time.findIndex((t) => new Date(t).getTime() >= now)
  );
  const afternoonIdx = hourly.time.findIndex((t) => {
    const d = new Date(t);
    return d.getTime() >= now && d.getHours() >= 15 && d.getHours() <= 18;
  });
  const peakRainIdx = afternoonIdx >= 0 ? afternoonIdx : startIdx;
  const peakRainChance = hourly.precipitationProbability[peakRainIdx] ?? rainChance;

  let rainClause = "";
  if (rainChance >= 60) {
    rainClause = ` There is a ${Math.round(peakRainChance)}% chance of rain${
      afternoonIdx >= 0 ? " during the afternoon" : " later today"
    }.`;
  } else if (rainChance >= 25) {
    rainClause = ` A slight chance of rain (${Math.round(rainChance)}%) is possible.`;
  }

  return `Today will be ${condition} with a high of ${high}°C.${rainClause}`;
}

export function WeatherSummary({
  current,
  daily,
  hourly,
}: {
  current: CurrentWeather;
  daily: DailyWeather;
  hourly: HourlyWeather;
}) {
  return (
    <p className="glass rounded-2xl px-5 py-4 text-sm leading-relaxed text-[var(--text-primary)]">
      {buildWeatherSummary(current, daily, hourly)}
    </p>
  );
}
