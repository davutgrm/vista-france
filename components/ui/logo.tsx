import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/** Vista logomark — a framed "vista": a window revealing a sunlit horizon. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={appConfig.name}>
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8dff" />
          <stop offset="0.55" stopColor="#2f63e0" />
          <stop offset="1" stopColor="#16307e" />
        </linearGradient>
        <linearGradient id="vsun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd784" />
          <stop offset="1" stopColor="#e6a52e" />
        </linearGradient>
        <clipPath id="vwin"><rect x="10.8" y="10.8" width="18.4" height="18.4" rx="4.2" /></clipPath>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#vg)" />
      <rect width="40" height="40" rx="11" fill="#fff" opacity="0.06" />
      <g clipPath="url(#vwin)">
        <rect x="10.8" y="10.8" width="18.4" height="18.4" fill="#16307e" />
        <circle cx="24.4" cy="16.6" r="3.1" fill="url(#vsun)" />
        <path d="M10 30 L15.5 22 L19.5 26.4 L24.2 19.6 L30 26.5 L30 30 Z" fill="#cfe0ff" opacity="0.85" />
        <path d="M10 30 L17 24.5 L22 28 L27 23 L30 26 L30 30 Z" fill="#fff" />
      </g>
      <rect x="10.8" y="10.8" width="18.4" height="18.4" rx="4.2" fill="none" stroke="#fff" strokeWidth="2.1" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
  onDark = false,
}: {
  className?: string;
  withWordmark?: boolean;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0 drop-shadow-sm" />
      {withWordmark && (
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            onDark ? "text-sidebar-foreground" : "text-foreground",
          )}
        >
          {appConfig.name}
        </span>
      )}
    </span>
  );
}
