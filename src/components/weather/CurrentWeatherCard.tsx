"use client";

import { motion } from "framer-motion";
import { Droplets, Eye, Gauge, Wind } from "lucide-react";
import { WeatherIcon } from "@/components/ui/WeatherIcon";
import { getWeatherCondition } from "@/lib/weather-codes";
import { useApp } from "@/context/AppContext";
import { formatTemp, windDirectionLabel } from "@/lib/utils";
import type { CurrentWeather, GeoLocation } from "@/types/weather";

interface Props {
  location: GeoLocation;
  current: CurrentWeather;
  today: { max: number; min: number; precipProb: number; precipSum: number };
}

export function CurrentWeatherCard({ location, current, today }: Props) {
  const { unit } = useApp();
  const condition = getWeatherCondition(current.weatherCode);

  const stats = [
    { icon: Droplets, label: "Humidity", value: `${Math.round(current.humidity)}%` },
    {
      icon: Wind,
      label: "Wind",
      value: `${Math.round(current.windSpeed)} km/h ${windDirectionLabel(current.windDirection)}`,
    },
    { icon: Gauge, label: "Pressure", value: `${Math.round(current.pressure)} hPa` },
    { icon: Eye, label: "Cloud cover", value: `${Math.round(current.cloudCover)}%` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      {/* Instrument-panel data strip */}
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
        <span>
          LAT {location.latitude.toFixed(2)}°N · LON {location.longitude.toFixed(2)}°E
        </span>
        <span className="h-1 w-1 rounded-full bg-[var(--text-secondary)]" />
        <span>{Math.round(current.pressure)} hPa</span>
        <span className="h-1 w-1 rounded-full bg-[var(--text-secondary)]" />
        <span>UPDATED {new Date(current.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <p className="font-display text-lg font-medium text-[var(--text-primary)] sm:text-xl">
            {location.name}
            {location.admin1 ? `, ${location.admin1}` : ""}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">{location.country}</p>

          <div className="mt-4 flex items-end gap-1">
            <span className="font-display text-6xl font-semibold leading-none text-[var(--text-primary)] sm:text-7xl">
              {formatTemp(current.temperature, unit, false)}
            </span>
            <span className="mb-2 font-display text-2xl text-[var(--text-secondary)]">
              {unit === "fahrenheit" ? "F" : "C"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Feels like {formatTemp(current.apparentTemperature, unit)} · {condition.label}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            H: {formatTemp(today.max, unit)} L: {formatTemp(today.min, unit)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 self-center sm:self-start">
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={72} className="text-[var(--color-amber)]" />
          <span className="text-xs text-[var(--text-secondary)]">{today.precipProb}% rain</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-3">
            <Icon size={15} className="mb-2 text-[var(--text-secondary)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">{value}</p>
            <p className="text-[11px] text-[var(--text-secondary)]">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
