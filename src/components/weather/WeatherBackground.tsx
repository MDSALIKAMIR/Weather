"use client";

import { useMemo } from "react";
import type { WeatherMood } from "@/lib/weather-codes";
import { useApp } from "@/context/AppContext";

interface WeatherBackgroundProps {
  mood: WeatherMood;
}

/**
 * Ambient, weather-reactive backdrop built from concentric "isobar" contour
 * lines — the app's signature motif, styled after pressure-map instrument
 * displays. Kept subtle and non-distracting; respects reduced-motion and the
 * app's animation setting.
 */
export function WeatherBackground({ mood }: WeatherBackgroundProps) {
  const { settings } = useApp();
  const animate = settings.animationsEnabled;

  const accent = useMemo(() => {
    switch (mood) {
      case "clear-day":
        return "var(--color-amber)";
      case "clear-night":
        return "var(--color-violet)";
      case "cloudy":
        return "var(--text-secondary)";
      case "fog":
        return "var(--text-secondary)";
      case "rain":
        return "var(--color-cyan)";
      case "snow":
        return "var(--color-cyan-soft)";
      case "storm":
        return "var(--color-violet)";
      default:
        return "var(--color-amber)";
    }
  }, [mood]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Isobar contour field */}
      <svg
        className={animate ? "animate-pulse-slow" : ""}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", opacity: 0.16 }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse
            key={i}
            cx="600"
            cy="180"
            rx={140 + i * 80}
            ry={90 + i * 55}
            fill="none"
            stroke={accent}
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Weather-specific ambient layer */}
      {mood === "rain" && animate && <RainLayer />}
      {mood === "snow" && animate && <SnowLayer />}
      {mood === "cloudy" && animate && <CloudLayer />}
      {mood === "storm" && <StormLayer animate={animate} />}
      {mood === "clear-night" && <StarsLayer />}

      {/* Base gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--color-amber) 6%, transparent), transparent)",
        }}
      />
    </div>
  );
}

function RainLayer() {
  const drops = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: `${(i * 2.7) % 100}%`,
        delay: `${(i % 10) * 0.3}s`,
        duration: `${1 + (i % 5) * 0.2}s`,
      })),
    []
  );
  return (
    <div className="absolute inset-0 opacity-[0.12]">
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 h-10 w-px bg-[var(--color-cyan)]"
          style={{
            left: d.left,
            animation: `fall ${d.duration} linear ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function SnowLayer() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        left: `${(i * 3.4) % 100}%`,
        delay: `${(i % 10) * 0.6}s`,
        duration: `${6 + (i % 6)}s`,
        size: 2 + (i % 3),
      })),
    []
  );
  return (
    <div className="absolute inset-0 opacity-20">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-[var(--color-cyan-soft)]"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animation: `fall ${f.duration} linear ${f.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CloudLayer() {
  return (
    <div className="absolute inset-0 opacity-[0.07]">
      <div className="animate-drift absolute top-24 h-40 w-[200%] rounded-full bg-[var(--text-secondary)] blur-3xl" />
    </div>
  );
}

function StormLayer({ animate }: { animate: boolean }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-violet)]/10 via-transparent to-transparent">
      {animate && (
        <div className="absolute inset-0 animate-[pulse-slow_5s_ease-in-out_infinite] bg-[var(--color-violet)]/5" />
      )}
    </div>
  );
}

function StarsLayer() {
  const stars = useMemo(
    () =>
      Array.from({ length: 45 }).map((_, i) => ({
        left: `${(i * 7.3) % 100}%`,
        top: `${(i * 13.1) % 60}%`,
        size: 1 + (i % 2),
      })),
    []
  );
  return (
    <div className="absolute inset-0 opacity-40">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
        />
      ))}
    </div>
  );
}
