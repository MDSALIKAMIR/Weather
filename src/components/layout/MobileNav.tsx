"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun, Gauge, History, LayoutDashboard, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/forecast", label: "Forecast", icon: CloudSun },
  { href: "/historical", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: Gauge },
  { href: "/favorites", label: "Saved", icon: Star },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around px-1 py-2 lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Primary"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] transition-colors",
              active ? "text-[var(--color-amber)]" : "text-[var(--text-secondary)]"
            )}
          >
            <Icon size={19} strokeWidth={active ? 2.25 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
