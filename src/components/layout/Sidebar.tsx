"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun, Gauge, History, LayoutDashboard, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forecast", label: "Forecast", icon: CloudSun },
  { href: "/historical", label: "Historical", icon: History },
  { href: "/compare", label: "Compare", icon: Gauge },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-amber)] text-[var(--color-ink)]">
          <CloudSun size={18} strokeWidth={2.25} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-none text-[var(--text-primary)]">Isobar</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
            Weather Instruments
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Primary">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[var(--surface-3)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] px-6 py-4">
        <p className="font-mono text-[10px] leading-relaxed text-[var(--text-secondary)]">
          DATA SOURCE
          <br />
          OPEN-METEO.COM
        </p>
      </div>
    </aside>
  );
}
