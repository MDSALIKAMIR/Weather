import { useApp } from "@/context/AppContext";
import { formatTemp } from "@/lib/utils";
import type { DailyWeather } from "@/types/weather";

export function TodaySummary({ daily, index = 0 }: { daily: DailyWeather; index?: number }) {
  const { unit } = useApp();

  const items = [
    { label: "Max Temp", value: formatTemp(daily.temperatureMax[index], unit) },
    { label: "Min Temp", value: formatTemp(daily.temperatureMin[index], unit) },
    { label: "Rain Chance", value: `${daily.precipitationProbabilityMax[index] ?? 0}%` },
    { label: "Precipitation", value: `${daily.precipitationSum[index]?.toFixed(1) ?? 0} mm` },
    { label: "Wind", value: `${Math.round(daily.windSpeedMax[index])} km/h` },
    { label: "UV Index", value: `${Math.round(daily.uvIndexMax?.[index] ?? 0)}` },
  ];

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-4 font-display text-base font-semibold text-[var(--text-primary)]">Today&apos;s summary</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-lg font-medium text-[var(--text-primary)]">{item.value}</p>
            <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
