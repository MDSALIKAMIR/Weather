import type { TemperatureUnit, TimeFormat } from "@/types/weather";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Open-Meteo returns Celsius by default; convert for display only. */
export function formatTemp(celsius: number, unit: TemperatureUnit, withUnit = true): string {
  const value = unit === "fahrenheit" ? celsius * (9 / 5) + 32 : celsius;
  const rounded = Math.round(value);
  return withUnit ? `${rounded}°${unit === "fahrenheit" ? "F" : "C"}` : `${rounded}°`;
}

export function celsiusToDisplay(celsius: number, unit: TemperatureUnit): number {
  return Math.round(unit === "fahrenheit" ? celsius * (9 / 5) + 32 : celsius);
}

export function formatTime(iso: string, format: TimeFormat, timezone?: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: format === "24h" ? "2-digit" : undefined,
    hour12: format === "12h",
    ...(timezone ? { timeZone: timezone } : {}),
  });
}

export function formatHour(iso: string, format: TimeFormat, timezone?: string): string {
  const date = new Date(iso);
  if (format === "24h") {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...(timezone ? { timeZone: timezone } : {}),
    });
  }
  return date
    .toLocaleTimeString("en-US", { hour: "numeric", hour12: true, ...(timezone ? { timeZone: timezone } : {}) })
    .replace(" ", "");
}

export function formatDayName(iso: string, opts: { short?: boolean } = {}): string {
  const date = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return date.toLocaleDateString("en-US", { weekday: opts.short ? "short" : "long" });
}

export function formatDateLabel(iso: string): string {
  const date = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function isToday(iso: string): boolean {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function windDirectionLabel(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
