"use client";

import { useEffect, useState } from "react";
import { Calendar, Droplets, Sunrise, Sunset, Wind } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getHistoricalWeather } from "@/services/historical";
import { WeatherIcon } from "@/components/ui/WeatherIcon";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { RainChart } from "@/components/charts/RainChart";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { WindChart } from "@/components/charts/WindChart";
import { CardSkeleton, ChartSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatDateLabel, formatTemp, formatTime, daysAgoIso } from "@/lib/utils";
import { getWeatherCondition } from "@/lib/weather-codes";
import { WeatherApiError, type HistoricalResponse } from "@/types/weather";

export default function HistoricalPage() {
  const { location, unit, timeFormat } = useApp();
  const [date, setDate] = useState(daysAgoIso(1));
  const [data, setData] = useState<HistoricalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getHistoricalWeather(location, date)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof WeatherApiError ? err.message : "Couldn't load historical weather.");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude, date]);

  const condition = data ? getWeatherCondition(data.daily.weatherCode[0]) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Historical weather</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {location.name}, {location.country || location.admin1}
        </p>
      </div>

      <label className="glass flex w-fit items-center gap-3 rounded-2xl px-4 py-3">
        <Calendar size={16} className="text-[var(--text-secondary)]" />
        <span className="text-sm text-[var(--text-secondary)]">Select a date</span>
        <input
          type="date"
          value={date}
          max={daysAgoIso(1)}
          min="1940-01-01"
          onChange={(e) => e.target.value && setDate(e.target.value)}
          className="bg-transparent text-sm text-[var(--text-primary)] focus:outline-none [color-scheme:dark]"
        />
      </label>

      {error && <ErrorState message={error} />}

      {!error && (loading || !data) && <CardSkeleton />}

      {!error && data && condition && (
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            {formatDateLabel(data.date)}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <WeatherIcon code={data.daily.weatherCode[0]} size={48} className="text-[var(--color-amber)]" />
              <div>
                <p className="font-display text-3xl font-semibold text-[var(--text-primary)]">
                  {formatTemp((data.daily.temperatureMax[0] + data.daily.temperatureMin[0]) / 2, unit)}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">{condition.label}</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-[var(--text-secondary)]">High</p>
                <p className="font-medium text-[var(--text-primary)]">{formatTemp(data.daily.temperatureMax[0], unit)}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Low</p>
                <p className="font-medium text-[var(--text-primary)]">{formatTemp(data.daily.temperatureMin[0], unit)}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Droplets size={12} /> Rain
                </p>
                <p className="font-medium text-[var(--text-primary)]">{data.daily.precipitationSum[0].toFixed(1)} mm</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Wind size={12} /> Wind
                </p>
                <p className="font-medium text-[var(--text-primary)]">{Math.round(data.daily.windSpeedMax[0])} km/h</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-8 border-t border-[var(--border)] pt-4 text-sm">
            <span className="flex items-center gap-2">
              <Sunrise size={14} className="text-[var(--color-amber)]" />
              {formatTime(data.daily.sunrise[0], timeFormat, data.location.timezone)}
            </span>
            <span className="flex items-center gap-2">
              <Sunset size={14} className="text-[var(--color-violet)]" />
              {formatTime(data.daily.sunset[0], timeFormat, data.location.timezone)}
            </span>
          </div>
        </div>
      )}

      {!error && (loading || !data) && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      )}

      {!error && data && (
        <div className="grid gap-6 lg:grid-cols-2">
          <TemperatureChart
            time={data.hourly.time}
            temperature={data.hourly.temperature}
            apparentTemperature={data.hourly.apparentTemperature}
            timezone={data.location.timezone}
            title="Temperature throughout the day"
          />
          <RainChart time={data.hourly.time} precipitation={data.hourly.precipitation} timezone={data.location.timezone} />
          <HumidityChart time={data.hourly.time} humidity={data.hourly.humidity} timezone={data.location.timezone} />
          <WindChart time={data.hourly.time} windSpeed={data.hourly.windSpeed} timezone={data.location.timezone} />
        </div>
      )}

      <p className="text-xs text-[var(--text-secondary)]">
        Historical data comes from the Open-Meteo reanalysis archive and generally covers 1940 to yesterday.
      </p>
    </div>
  );
}
