"use client";

import { Sunrise, Sunset } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatTime } from "@/lib/utils";

interface Props {
  sunrise: string;
  sunset: string;
  timezone: string;
}

export function SunriseSunsetCard({ sunrise, sunset, timezone }: Props) {
  const { timeFormat } = useApp();
  const now = Date.now();
  const sunriseMs = new Date(sunrise).getTime();
  const sunsetMs = new Date(sunset).getTime();
  const progress = Math.min(1, Math.max(0, (now - sunriseMs) / (sunsetMs - sunriseMs)));
  const isDaytime = now >= sunriseMs && now <= sunsetMs;

  // Semicircle arc position for the sun marker
  const angle = Math.PI * (1 - progress);
  const cx = 100 + 80 * Math.cos(angle);
  const cy = 100 - 80 * Math.sin(angle);

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-2 font-display text-base font-semibold text-[var(--text-primary)]">Sunrise &amp; sunset</h3>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--surface-3)" strokeWidth="2" />
          {isDaytime && (
            <circle cx={cx} cy={cy} r="6" fill="var(--color-amber)">
              <title>Current sun position</title>
            </circle>
          )}
          <line x1="20" y1="100" x2="180" y2="100" stroke="var(--border)" strokeWidth="1" />
        </svg>
        <div className="mt-2 flex w-full justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sunrise size={16} className="text-[var(--color-amber)]" />
            <span className="text-[var(--text-primary)]">{formatTime(sunrise, timeFormat, timezone)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-primary)]">{formatTime(sunset, timeFormat, timezone)}</span>
            <Sunset size={16} className="text-[var(--color-violet)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
