"use client";

import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { WeatherIcon } from "@/components/ui/WeatherIcon";
import { useApp } from "@/context/AppContext";
import { formatHour, formatTemp } from "@/lib/utils";
import type { HourlyWeather } from "@/types/weather";

interface Props {
  hourly: HourlyWeather;
  timezone: string;
  hours?: number;
}

export function HourlyForecast({ hourly, timezone, hours = 24 }: Props) {
  const { unit, timeFormat } = useApp();
  const now = Date.now();
  const startIdx = Math.max(
    0,
    hourly.time.findIndex((t) => new Date(t).getTime() >= now)
  );
  const slice = hourly.time.slice(startIdx, startIdx + hours);

  return (
    <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
      {slice.map((t, i) => {
        const idx = startIdx + i;
        return (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
            className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-3"
          >
            <span className="text-[11px] text-[var(--text-secondary)]">
              {i === 0 ? "Now" : formatHour(t, timeFormat, timezone)}
            </span>
            <WeatherIcon code={hourly.weatherCode[idx]} size={26} className="text-[var(--color-amber)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {formatTemp(hourly.temperature[idx], unit)}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-[var(--color-cyan)]">
              <Droplets size={10} />
              {hourly.precipitationProbability[idx] ?? 0}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
