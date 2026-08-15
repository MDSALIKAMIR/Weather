"use client";

import { useEffect, useState } from "react";
import { Wind } from "lucide-react";
import { getAirQuality, aqiLabel } from "@/services/airquality";
import { CardSkeleton } from "@/components/ui/Skeletons";
import type { AirQualityData, GeoLocation } from "@/types/weather";
import { cn } from "@/lib/utils";

export function AirQualityCard({ location }: { location: GeoLocation }) {
  const [data, setData] = useState<AirQualityData | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setData(undefined);
    getAirQuality(location).then((res) => {
      if (!cancelled) setData(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude]);

  if (data === undefined) return <CardSkeleton />;
  if (data === null) return null; // feature unavailable — degrade gracefully, no fake data

  const aqi = data.europeanAqi[0];
  const { label, tone } = aqiLabel(aqi);

  const metrics = [
    { label: "PM2.5", value: data.pm2_5[0], unit: "µg/m³" },
    { label: "PM10", value: data.pm10[0], unit: "µg/m³" },
    { label: "CO", value: data.carbonMonoxide[0], unit: "µg/m³" },
    { label: "NO₂", value: data.nitrogenDioxide[0], unit: "µg/m³" },
    { label: "O₃", value: data.ozone[0], unit: "µg/m³" },
  ];

  const toneColor =
    tone === "good"
      ? "var(--color-good)"
      : tone === "moderate"
      ? "var(--color-amber)"
      : "var(--color-severe)";

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold text-[var(--text-primary)]">
          <Wind size={16} /> Air quality
        </h3>
        <span
          className={cn("rounded-full px-2.5 py-1 text-xs font-medium")}
          style={{ background: `color-mix(in srgb, ${toneColor} 18%, transparent)`, color: toneColor }}
        >
          {label} · {Math.round(aqi)} AQI
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-sm font-medium text-[var(--text-primary)]">{Math.round(m.value)}</p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {m.label} {m.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
