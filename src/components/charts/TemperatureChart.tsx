"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "@/context/AppContext";
import { celsiusToDisplay, formatHour } from "@/lib/utils";

interface Props {
  time: string[];
  temperature: number[];
  apparentTemperature?: number[];
  timezone: string;
  title?: string;
}

export function TemperatureChart({ time, temperature, apparentTemperature, timezone, title = "Temperature" }: Props) {
  const { unit, timeFormat } = useApp();
  const data = time.map((t, i) => ({
    time: formatHour(t, timeFormat, timezone),
    temp: celsiusToDisplay(temperature[i], unit),
    feels: apparentTemperature ? celsiusToDisplay(apparentTemperature[i], unit) : undefined,
  }));

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-4 font-display text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-amber)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-amber)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} interval="preserveStartEnd" />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            tickFormatter={(v) => `${v}°`}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--text-secondary)" }}
            formatter={(value, name) => [`${value}°${unit === "fahrenheit" ? "F" : "C"}`, name === "temp" ? "Temperature" : "Feels like"]}
          />
          <Area type="monotone" dataKey="temp" stroke="var(--color-amber)" strokeWidth={2} fill="url(#tempGradient)" />
          {apparentTemperature && (
            <Area type="monotone" dataKey="feels" stroke="var(--color-violet)" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
