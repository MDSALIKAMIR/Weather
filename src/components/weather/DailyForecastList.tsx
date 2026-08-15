"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Wind } from "lucide-react";
import { WeatherIcon } from "@/components/ui/WeatherIcon";
import { useApp } from "@/context/AppContext";
import { formatDayName, formatDateLabel, formatHour, formatTemp, isToday } from "@/lib/utils";
import type { DailyWeather, HourlyWeather } from "@/types/weather";
import { cn } from "@/lib/utils";

interface Props {
  daily: DailyWeather;
  hourly: HourlyWeather;
  timezone: string;
  days?: number;
}

export function DailyForecastList({ daily, hourly, timezone, days = 7 }: Props) {
  const { unit, timeFormat } = useApp();
  const [expanded, setExpanded] = useState<number | null>(null);

  const count = Math.min(days, daily.time.length);

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => {
        const date = daily.time[i];
        const isOpen = expanded === i;
        const dayHourly = hourly.time
          .map((t, idx) => ({ t, idx }))
          .filter(({ t }) => t.startsWith(date));

        return (
          <div key={date} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60">
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-6"
              aria-expanded={isOpen}
            >
              <span className="w-16 shrink-0 text-sm font-medium text-[var(--text-primary)] sm:w-24">
                {isToday(date) ? "Today" : formatDayName(date, { short: true })}
              </span>
              <WeatherIcon code={daily.weatherCode[i]} size={22} className="shrink-0 text-[var(--color-amber)]" />
              <span className="flex items-center gap-1 text-xs text-[var(--color-cyan)] w-12 shrink-0">
                <Droplets size={11} />
                {daily.precipitationProbabilityMax[i] ?? 0}%
              </span>
              <span className="hidden flex-1 truncate text-xs text-[var(--text-secondary)] sm:block">
                {formatDateLabel(date)}
              </span>
              <span className="ml-auto flex items-center gap-2 text-sm shrink-0">
                <span className="text-[var(--text-secondary)]">{formatTemp(daily.temperatureMin[i], unit)}</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatTemp(daily.temperatureMax[i], unit)}
                </span>
              </span>
              <ChevronDown
                size={16}
                className={cn("shrink-0 text-[var(--text-secondary)] transition-transform", isOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="scrollbar-thin flex gap-3 overflow-x-auto border-t border-[var(--border)] px-4 py-4">
                    {dayHourly.map(({ t, idx }) => (
                      <div key={t} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {formatHour(t, timeFormat, timezone)}
                        </span>
                        <WeatherIcon code={hourly.weatherCode[idx]} size={18} className="text-[var(--color-amber)]" />
                        <span className="text-xs font-medium text-[var(--text-primary)]">
                          {formatTemp(hourly.temperature[idx], unit)}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] text-[var(--text-secondary)]">
                          <Wind size={9} />
                          {Math.round(hourly.windSpeed[idx])}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
