"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Wind } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useForecast } from "@/hooks/useForecast";
import { getHistoricalWeather } from "@/services/historical";
import { WeatherIcon } from "@/components/ui/WeatherIcon";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatDateLabel, formatTemp, daysAgoIso } from "@/lib/utils";
import { getWeatherCondition } from "@/lib/weather-codes";
import { WeatherApiError, type HistoricalResponse } from "@/types/weather";

function yearAgoIso(iso: string) {
  const d = new Date(iso + "T00:00:00");
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

export default function ComparePage() {
  const { location, unit } = useApp();
  const { data: forecast, loading: forecastLoading, error: forecastError } = useForecast(location);

  const today = daysAgoIso(0);
  const [pastDate, setPastDate] = useState(yearAgoIso(today));
  const [futureIndex, setFutureIndex] = useState(1); // 0 = today, 1 = tomorrow, etc.

  const [past, setPast] = useState<HistoricalResponse | null>(null);
  const [pastLoading, setPastLoading] = useState(true);
  const [pastError, setPastError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPastLoading(true);
    setPastError(null);
    getHistoricalWeather(location, pastDate)
      .then((res) => {
        if (!cancelled) setPast(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setPastError(err instanceof WeatherApiError ? err.message : "Couldn't load that historical date.");
          setPast(null);
        }
      })
      .finally(() => {
        if (!cancelled) setPastLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude, pastDate]);

  if (forecastError) return <ErrorState message={forecastError} onRetry={() => window.location.reload()} />;

  const futureDates = forecast?.daily.time ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Past · Present · Future</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Compare how {location.name}&apos;s weather has changed and where it&apos;s headed.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm">
          <span className="text-[var(--text-secondary)]">Past date</span>
          <input
            type="date"
            value={pastDate}
            max={daysAgoIso(1)}
            min="1940-01-01"
            onChange={(e) => e.target.value && setPastDate(e.target.value)}
            className="bg-transparent text-[var(--text-primary)] focus:outline-none [color-scheme:dark]"
          />
        </label>

        {futureDates.length > 1 && (
          <label className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm">
            <span className="text-[var(--text-secondary)]">Future date</span>
            <select
              value={futureIndex}
              onChange={(e) => setFutureIndex(Number(e.target.value))}
              className="bg-transparent text-[var(--text-primary)] focus:outline-none"
            >
              {futureDates.slice(1).map((d, i) => (
                <option key={d} value={i + 1} className="bg-[var(--surface-2)]">
                  {formatDateLabel(d)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Timeline */}
      <div className="glass overflow-hidden rounded-3xl p-4 sm:p-6">
        <div className="flex items-center justify-center gap-2 pb-4 text-xs text-[var(--text-secondary)]">
          <span>PAST</span>
          <ArrowRight size={12} />
          <span>PRESENT</span>
          <ArrowRight size={12} />
          <span>FUTURE</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TimelineCard
            label="Past"
            date={past ? formatDateLabel(past.date) : "—"}
            loading={pastLoading}
            error={pastError}
            code={past?.daily.weatherCode[0]}
            max={past?.daily.temperatureMax[0]}
            min={past?.daily.temperatureMin[0]}
            precip={past?.daily.precipitationSum[0]}
            wind={past?.daily.windSpeedMax[0]}
            unit={unit}
            accent="var(--text-secondary)"
          />
          <TimelineCard
            label="Present"
            date={forecast ? formatDateLabel(forecast.daily.time[0]) : "—"}
            loading={forecastLoading}
            error={null}
            code={forecast?.daily.weatherCode[0]}
            max={forecast?.daily.temperatureMax[0]}
            min={forecast?.daily.temperatureMin[0]}
            precip={forecast?.daily.precipitationSum[0]}
            wind={forecast?.daily.windSpeedMax[0]}
            unit={unit}
            accent="var(--color-amber)"
            highlight
          />
          <TimelineCard
            label="Future"
            date={forecast ? formatDateLabel(forecast.daily.time[futureIndex]) : "—"}
            loading={forecastLoading}
            error={null}
            code={forecast?.daily.weatherCode[futureIndex]}
            max={forecast?.daily.temperatureMax[futureIndex]}
            min={forecast?.daily.temperatureMin[futureIndex]}
            precip={forecast?.daily.precipitationSum[futureIndex]}
            wind={forecast?.daily.windSpeedMax[futureIndex]}
            unit={unit}
            accent="var(--color-cyan)"
          />
        </div>
      </div>

      {/* Delta summary */}
      {past && forecast && !pastLoading && !forecastLoading && (
        <DeltaSummary past={past} forecast={forecast} futureIndex={futureIndex} unit={unit} />
      )}
    </div>
  );
}

function TimelineCard({
  label,
  date,
  loading,
  error,
  code,
  max,
  min,
  precip,
  wind,
  unit,
  accent,
  highlight,
}: {
  label: string;
  date: string;
  loading: boolean;
  error: string | null;
  code?: number;
  max?: number;
  min?: number;
  precip?: number;
  wind?: number;
  unit: "celsius" | "fahrenheit";
  accent: string;
  highlight?: boolean;
}) {
  if (loading) return <CardSkeleton className="h-56" />;
  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-5 text-center text-xs text-[var(--color-severe)]">
        {error}
      </div>
    );
  }
  const condition = code !== undefined ? getWeatherCondition(code) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-5"
      style={{
        borderColor: highlight ? accent : "var(--border)",
        background: "color-mix(in srgb, var(--surface-2) 80%, transparent)",
      }}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: accent }}>
        {label}
      </p>
      <p className="mb-3 text-xs text-[var(--text-secondary)]">{date}</p>
      {code !== undefined ? (
        <>
          <div className="flex items-center gap-3">
            <WeatherIcon code={code} size={32} style={{ color: accent } as React.CSSProperties} />
            <div>
              <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                {formatTemp(max ?? 0, unit)}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">{condition?.label}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-[var(--text-secondary)]">
            <span>Low {formatTemp(min ?? 0, unit)}</span>
            <span className="flex items-center gap-1">
              <Droplets size={11} /> {(precip ?? 0).toFixed(1)}mm
            </span>
            <span className="flex items-center gap-1">
              <Wind size={11} /> {Math.round(wind ?? 0)}
            </span>
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--text-secondary)]">No data</p>
      )}
    </motion.div>
  );
}

function DeltaSummary({
  past,
  forecast,
  futureIndex,
  unit,
}: {
  past: HistoricalResponse;
  forecast: NonNullable<ReturnType<typeof useForecast>["data"]>;
  futureIndex: number;
  unit: "celsius" | "fahrenheit";
}) {
  const pastMax = past.daily.temperatureMax[0];
  const presentMax = forecast.daily.temperatureMax[0];
  const futureMax = forecast.daily.temperatureMax[futureIndex];
  const pastToPresent = presentMax - pastMax;
  const presentToFuture = futureMax - presentMax;

  return (
    <div className="glass grid grid-cols-1 gap-4 rounded-3xl p-6 sm:grid-cols-2">
      <div>
        <p className="text-xs text-[var(--text-secondary)]">Past → Present</p>
        <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">
          {pastToPresent >= 0 ? "+" : ""}
          {formatTemp(pastToPresent, unit)}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">high temperature change</p>
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)]">Present → Future</p>
        <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">
          {presentToFuture >= 0 ? "+" : ""}
          {formatTemp(presentToFuture, unit)}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">expected high temperature change</p>
      </div>
    </div>
  );
}
