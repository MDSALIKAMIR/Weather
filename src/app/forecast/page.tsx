"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useForecast } from "@/hooks/useForecast";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecastList } from "@/components/weather/DailyForecastList";
import { HourlyForecastSkeleton, DailyForecastSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";

const RANGES = [
  { key: "24h", label: "Next 24 hours" },
  { key: "7d", label: "7 days" },
  { key: "16d", label: "16 days" },
] as const;

export default function ForecastPage() {
  const { location } = useApp();
  const { data, loading, error } = useForecast(location);
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("7d");

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Forecast</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {data ? `${data.location.name}, ${data.location.country}` : "Loading location…"}
        </p>
      </div>

      <div className="flex gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1 w-fit">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              range === r.key
                ? "bg-[var(--color-amber)] text-[var(--color-ink)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {range === "24h" &&
        (loading || !data ? (
          <HourlyForecastSkeleton />
        ) : (
          <HourlyForecast hourly={data.hourly} timezone={data.location.timezone} hours={24} />
        ))}

      {range === "7d" &&
        (loading || !data ? (
          <DailyForecastSkeleton />
        ) : (
          <DailyForecastList daily={data.daily} hourly={data.hourly} timezone={data.location.timezone} days={7} />
        ))}

      {range === "16d" &&
        (loading || !data ? (
          <DailyForecastSkeleton />
        ) : (
          <DailyForecastList daily={data.daily} hourly={data.hourly} timezone={data.location.timezone} days={16} />
        ))}

      <p className="text-xs text-[var(--text-secondary)]">
        Tap a day to see its hourly breakdown. Data availability beyond 7 days depends on the forecast model for
        this location.
      </p>
    </div>
  );
}
