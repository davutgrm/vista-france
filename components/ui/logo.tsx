import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={appConfig.name} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill="#000"/>
      <polyline points="6,22 20,8 34,22" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
      <rect x="9" y="22" width="22" height="12" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
      <rect x="15.5" y="27" width="9" height="7" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
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
      <LogoMark className="h-8 w-8 shrink-0" />
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
