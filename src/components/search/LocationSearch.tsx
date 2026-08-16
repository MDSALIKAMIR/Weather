"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, Search, Star, X } from "lucide-react";
import { searchLocations, reverseGeocode } from "@/services/geocoding";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useApp } from "@/context/AppContext";
import type { GeoLocation } from "@/types/weather";
import { cn } from "@/lib/utils";

export function LocationSearch({
  className,
  expanded = false,
}: {
  className?: string;
  expanded?: boolean;
}) {
  const { location, setLocation, addFavorite, isFavorite } = useApp();
  const { locate, loading: locating } = useGeolocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(query, 350);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setError(null);

    searchLocations(debounced)
      .then((res) => {
        if (!cancelled) setResults(res || []);
      })
      .catch(() => {
        if (!cancelled)
          setError("Couldn't search locations. Check your connection.");
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(loc: GeoLocation) {
    setLocation(loc);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  async function handleUseMyLocation() {
    setError(null);
    try {
      const { latitude, longitude } = await locate();
      const loc = await reverseGeocode(latitude, longitude);
      setLocation(loc);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not get your location."
      );
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 transition-colors focus-within:border-[var(--color-amber)]",
          expanded ? "h-12" : "h-10"
        )}
      >
        <Search size={16} className="shrink-0 text-[var(--text-secondary)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={`Search a city — currently ${location.name}`}
          aria-label="Search for a city"
          className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
        />
        {searching && (
          <Loader2 size={14} className="animate-spin text-[var(--text-secondary)]" />
        )}
        {query && !searching && (
          <button aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={14} className="text-[var(--text-secondary)]" />
          </button>
        )}
        <button
          onClick={handleUseMyLocation}
          disabled={locating}
          aria-label="Use my current location"
          className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--surface-3)] px-2.5 py-1 text-xs text-[var(--text-primary)] hover:bg-[var(--color-amber)] hover:text-[var(--color-ink)] disabled:opacity-60"
        >
          {locating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <MapPin size={12} />
          )}
          <span className="hidden sm:inline">My location</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (query || error) && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="glass absolute left-0 right-0 top-12 z-30 max-h-80 overflow-y-auto rounded-2xl p-2 shadow-2xl"
          >
            {error && (
              <p className="px-3 py-2 text-sm text-[var(--color-severe)]">
                {error}
              </p>
            )}
            {!error && results.length === 0 && !searching && query && (
              <p className="px-3 py-4 text-center text-sm text-[var(--text-secondary)]">
                No matching cities found.
              </p>
            )}
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-3)]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
                    {r.name}
                  </span>
                  <span className="block truncate text-xs text-[var(--text-secondary)]">
                    {[r.admin1, r.country].filter(Boolean).join(", ")}
                  </span>
                </span>
                <Star
                  size={14}
                  onClick={(e) => {
                    e.stopPropagation();
                    addFavorite(r);
                  }}
                  className={cn(
                    "shrink-0 transition-colors",
                    isFavorite(r.id)
                      ? "fill-[var(--color-amber)] text-[var(--color-amber)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--color-amber)]"
                  )}
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}