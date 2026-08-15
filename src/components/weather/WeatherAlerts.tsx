import { AlertTriangle } from "lucide-react";
import { getWeatherCondition } from "@/lib/weather-codes";
import type { DailyWeather, WeatherAlert } from "@/types/weather";

/**
 * Open-Meteo's free tier does not expose an official alerts feed, so alerts
 * here are derived transparently from the same forecast values already
 * shown elsewhere (condition severity, wind, precipitation) — never
 * invented. If nothing crosses a threshold, no alert is shown.
 */
function deriveAlerts(daily: DailyWeather): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const condition = getWeatherCondition(daily.weatherCode[0]);

  if (condition.severity === "severe") {
    alerts.push({
      id: "condition",
      title: condition.label,
      description: `${condition.label} expected today — plan accordingly.`,
      severity: "severe",
    });
  }
  if (daily.windGustsMax[0] >= 50) {
    alerts.push({
      id: "wind",
      title: "Strong wind",
      description: `Gusts up to ${Math.round(daily.windGustsMax[0])} km/h expected today.`,
      severity: daily.windGustsMax[0] >= 70 ? "severe" : "moderate",
    });
  }
  if (daily.precipitationSum[0] >= 30) {
    alerts.push({
      id: "rain",
      title: "Heavy rain",
      description: `${daily.precipitationSum[0].toFixed(0)} mm of precipitation expected today.`,
      severity: daily.precipitationSum[0] >= 60 ? "severe" : "moderate",
    });
  }
  if (daily.temperatureMax[0] >= 40) {
    alerts.push({
      id: "heat",
      title: "Extreme heat",
      description: `A high of ${Math.round(daily.temperatureMax[0])}°C is expected today.`,
      severity: "severe",
    });
  }
  if (daily.temperatureMin[0] <= -5) {
    alerts.push({
      id: "cold",
      title: "Extreme cold",
      description: `A low of ${Math.round(daily.temperatureMin[0])}°C is expected today.`,
      severity: "severe",
    });
  }

  return alerts;
}

export function WeatherAlerts({ daily }: { daily: DailyWeather }) {
  const alerts = deriveAlerts(daily);
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 rounded-2xl border border-[var(--color-severe)]/30 bg-[var(--color-severe)]/10 p-4"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--color-severe)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{alert.title}</p>
            <p className="text-xs text-[var(--text-secondary)]">{alert.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
