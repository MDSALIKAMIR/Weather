"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "@/context/AppContext";
import { formatHour } from "@/lib/utils";

interface Props {
  time: string[];
  precipitation: number[];
  precipitationProbability?: number[];
  timezone: string;
}

export function RainChart({ time, precipitation, precipitationProbability, timezone }: Props) {
  const { timeFormat } = useApp();
  const data = time.map((t, i) => ({
    time: formatHour(t, timeFormat, timezone),
    mm: Number((precipitation[i] ?? 0).toFixed(1)),
    prob: precipitationProbability?.[i] ?? undefined,
  }));

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-4 font-display text-base font-semibold text-[var(--text-primary)]">Precipitation</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} width={36} tickFormatter={(v) => `${v}mm`} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value, name) => [
              name === "mm" ? `${value} mm` : `${value}%`,
              name === "mm" ? "Precipitation" : "Chance of rain",
            ]}
          />
          <Bar dataKey="mm" fill="var(--color-cyan)" radius={[6, 6, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
