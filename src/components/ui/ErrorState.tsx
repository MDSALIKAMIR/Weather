import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl p-10 text-center">
      <AlertTriangle size={28} className="text-[var(--color-severe)]" />
      <p className="max-w-sm text-sm text-[var(--text-secondary)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 rounded-full bg-[var(--surface-3)] px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-amber)] hover:text-[var(--color-ink)]"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
