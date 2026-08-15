"use client";

import { useApp } from "@/context/AppContext";
import { useForecast } from "@/hooks/useForecast";
import { WeatherBackground } from "@/components/weather/WeatherBackground";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { TodaySummary } from "@/components/weather/TodaySummary";
import { SunriseSunsetCard } from "@/components/weather/SunriseSunsetCard";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { WeatherAlerts } from "@/components/weather/WeatherAlerts";
import { WeatherSummary } from "@/components/weather/WeatherSummary";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { RainChart } from "@/components/charts/RainChart";
import {
  CurrentWeatherSkeleton,
  HourlyForecastSkeleton,
  CardSkeleton,
  ChartSkeleton,
} from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { getWeatherMood } from "@/lib/weather-codes";

export default function DashboardPage() {
  const { location } = useApp();
  const { data, loading, error } = useForecast(location);

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const mood = data ? getWeatherMood(data.current.weatherCode, data.current.isDay) : "clear-day";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <WeatherBackground mood={mood} />

      {loading || !data ? (
        <CurrentWeatherSkeleton />
      ) : (
        <CurrentWeatherCard
          location={data.location}
          current={data.current}
          today={{
            max: data.daily.temperatureMax[0],
            min: data.daily.temperatureMin[0],
            precipProb: data.daily.precipitationProbabilityMax[0] ?? 0,
            precipSum: data.daily.precipitationSum[0] ?? 0,
          }}
        />
      )}

      {data && !loading && <WeatherAlerts daily={data.daily} />}
      {data && !loading && <WeatherSummary current={data.current} daily={data.daily} hourly={data.hourly} />}

      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-[var(--text-primary)]">Next 24 hours</h2>
        {loading || !data ? (
          <HourlyForecastSkeleton />
        ) : (
          <HourlyForecast hourly={data.hourly} timezone={data.location.timezone} />
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {loading || !data ? <CardSkeleton /> : <TodaySummary daily={data.daily} />}
        {loading || !data ? <CardSkeleton /> : <SunriseSunsetCard sunrise={data.daily.sunrise[0]} sunset={data.daily.sunset[0]} timezone={data.location.timezone} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {loading || !data ? (
          <ChartSkeleton />
        ) : (
          <TemperatureChart
            time={data.hourly.time.slice(0, 24)}
            temperature={data.hourly.temperature.slice(0, 24)}
            apparentTemperature={data.hourly.apparentTemperature.slice(0, 24)}
            timezone={data.location.timezone}
          />
        )}
        {loading || !data ? (
          <ChartSkeleton />
        ) : (
          <RainChart
            time={data.hourly.time.slice(0, 24)}
            precipitation={data.hourly.precipitation.slice(0, 24)}
            precipitationProbability={data.hourly.precipitationProbability.slice(0, 24)}
            timezone={data.location.timezone}
          />
        )}
      </div>

      {loading || !data ? <CardSkeleton /> : <AirQualityCard location={data.location} />}
    </div>
  );
}
