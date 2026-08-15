"use client";

import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useForecast } from "@/hooks/useForecast";
import { WeatherIcon } from "@/components/ui/WeatherIcon";
import { formatTemp } from "@/lib/utils";
import type { FavoriteLocation } from "@/types/weather";

export default function FavoritesPage() {
  const { favorites, removeFavorite, setLocation, hydrated } = useApp();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Favorite locations</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Star a city from search to save it here for quick access.
        </p>
      </div>

      {hydrated && favorites.length === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
          <Star size={28} className="text-[var(--text-secondary)]" />
          <p className="text-sm text-[var(--text-secondary)]">No favorites yet. Search for a city and tap the star.</p>
        </div>
      )}

      <div className="space-y-3">
        {favorites.map((fav) => (
          <FavoriteRow
            key={fav.id}
            favorite={fav}
            onSelect={() => setLocation(fav)}
            onRemove={() => removeFavorite(fav.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FavoriteRow({
  favorite,
  onSelect,
  onRemove,
}: {
  favorite: FavoriteLocation;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { unit } = useApp();
  const { data, loading } = useForecast(favorite);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex items-center justify-between gap-4 rounded-2xl p-4"
    >
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-4 text-left">
        {!loading && data ? (
          <WeatherIcon code={data.current.weatherCode} isDay={data.current.isDay} size={30} className="text-[var(--color-amber)]" />
        ) : (
          <div className="h-[30px] w-[30px] shrink-0 animate-pulse rounded-full bg-[var(--surface-3)]" />
        )}
        <span className="min-w-0">
          <span className="block truncate font-medium text-[var(--text-primary)]">{favorite.name}</span>
          <span className="block truncate text-xs text-[var(--text-secondary)]">
            {[favorite.admin1, favorite.country].filter(Boolean).join(", ")}
          </span>
        </span>
        {!loading && data && (
          <span className="ml-auto shrink-0 font-display text-xl font-medium text-[var(--text-primary)]">
            {formatTemp(data.current.temperature, unit)}
          </span>
        )}
      </button>
      <button
        onClick={onRemove}
        aria-label={`Remove ${favorite.name} from favorites`}
        className="shrink-0 rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--color-severe)]/15 hover:text-[var(--color-severe)]"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
