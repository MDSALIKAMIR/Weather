"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { UnitToggle } from "@/components/ui/Toggles";
import { cn } from "@/lib/utils";

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--text-secondary)]">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-[var(--color-amber)]" : "bg-[var(--surface-3)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    timeFormat,
    setTimeFormat,
    settings,
    setSettings,
    location,
    defaultLocationId,
    setDefaultLocationId,
    clearFavorites,
    favorites,
  } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">Personalize units, appearance, and behavior.</p>
      </div>

      <div className="glass rounded-3xl px-6">
        <SettingRow label="Temperature unit" description="Applies across the whole app">
          <UnitToggle />
        </SettingRow>

        <SettingRow label="Theme" description="Dark or light appearance">
          <div className="flex gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded-full px-3 py-1.5 capitalize transition-colors",
                  theme === t ? "bg-[var(--color-amber)] text-[var(--color-ink)]" : "text-[var(--text-secondary)]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Time format" description="12-hour or 24-hour clock">
          <div className="flex gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
            {(["12h", "24h"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFormat(f)}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors",
                  timeFormat === f ? "bg-[var(--color-amber)] text-[var(--color-ink)]" : "text-[var(--text-secondary)]"
                )}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Weather animations" description="Ambient rain, snow, and cloud motion">
          <Switch
            checked={settings.animationsEnabled}
            onChange={(v) => setSettings((s) => ({ ...s, animationsEnabled: v }))}
            label="Toggle weather animations"
          />
        </SettingRow>

        <SettingRow label="Default location" description="Used when the app opens">
          <Switch
            checked={defaultLocationId === location.id}
            onChange={(v) => setDefaultLocationId(v ? location.id : null)}
            label="Set current location as default"
          />
        </SettingRow>

        <SettingRow
          label="Clear favorite locations"
          description={`${favorites.length} saved location${favorites.length === 1 ? "" : "s"}`}
        >
          {confirmClear ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  clearFavorites();
                  setConfirmClear(false);
                }}
                className="rounded-full bg-[var(--color-severe)] px-3 py-1.5 text-xs text-white"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-full bg-[var(--surface-3)] px-3 py-1.5 text-xs text-[var(--text-primary)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={favorites.length === 0}
              className="rounded-full bg-[var(--surface-3)] px-3 py-1.5 text-xs text-[var(--text-primary)] disabled:opacity-40"
            >
              Clear all
            </button>
          )}
        </SettingRow>
      </div>
    </div>
  );
}
