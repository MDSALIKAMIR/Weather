"use client";

import { CloudSun, MapPin } from "lucide-react";
import { LocationSearch } from "@/components/search/LocationSearch";
import { UnitToggle, ThemeToggle } from "@/components/ui/Toggles";
import { useApp } from "@/context/AppContext";

export function Header() {
  const { location } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:pl-[15.5rem] lg:pr-8">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-amber)] text-[var(--color-ink)]">
            <CloudSun size={16} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <LocationSearch />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)] sm:flex">
          <MapPin size={12} />
          {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
        </div>

        <UnitToggle className="shrink-0" />
        <ThemeToggle className="shrink-0" />
      </div>
    </header>
  );
}
