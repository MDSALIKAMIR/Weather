"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "@/context/AppContext";
import { formatHour } from "@/lib/utils";

interface Props {
  time: string[];
  windSpeed: number[];
  timezone: string;
}

export function WindChart({ time, windSpeed, timezone }: Props) {
  const { timeFormat } = useApp();
  const data = time.map((t, i) => ({ time: formatHour(t, timeFormat, timezone), wind: Math.round(windSpeed[i]) }));

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-4 font-display text-base font-semibold text-[var(--text-primary)]">Wind speed</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} interval="preserveStartEnd" />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            width={40}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value) => [`${value} km/h`, "Wind speed"]}
          />
          <Line type="monotone" dataKey="wind" stroke="var(--color-violet)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
