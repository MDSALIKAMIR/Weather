import { getWeatherIcon } from "@/lib/weather-codes";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export function WeatherIcon({ code, isDay = true, className, size = 24, style }: WeatherIconProps) {
  const Icon = getWeatherIcon(code, isDay);
  return <Icon size={size} style={style} className={cn("shrink-0", className)} strokeWidth={1.75} aria-hidden="true" />;
}
