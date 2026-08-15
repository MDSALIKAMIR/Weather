"use client";

import { Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function UnitToggle({ className }: { className?: string }) {
  const { unit, setUnit } = useApp();
  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-0.5 font-mono text-xs",
        className
      )}
      role="group"
      aria-label="Temperature unit"
    >
      {(["celsius", "fahrenheit"] as const).map((u) => (
        <button
          key={u}
          onClick={() => setUnit(u)}
          aria-pressed={unit === u}
          className={cn(
            "rounded-full px-2.5 py-1.5 transition-colors",
            unit === u
              ? "bg-[var(--color-amber)] text-[var(--color-ink)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          {u === "celsius" ? "°C" : "°F"}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-3)]",
        className
      )}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
