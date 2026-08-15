import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[var(--surface-2)]",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

export function CurrentWeatherSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8" role="status" aria-label="Loading current weather">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-14 w-40" />
          <Shimmer className="h-4 w-48" />
        </div>
        <Shimmer className="h-20 w-20 rounded-full" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}

export function HourlyForecastSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden" role="status" aria-label="Loading hourly forecast">
      {Array.from({ length: 8 }).map((_, i) => (
        <Shimmer key={i} className="h-32 w-20 shrink-0" />
      ))}
    </div>
  );
}

export function DailyForecastSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Loading forecast">
      {Array.from({ length: 6 }).map((_, i) => (
        <Shimmer key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return <Shimmer className="h-64 w-full" />;
}

export function CardSkeleton({ className }: { className?: string }) {
  return <Shimmer className={cn("h-40 w-full", className)} />;
}
