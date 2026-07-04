"use client";

import { usePathname } from "next/navigation";
import appConfig from "@/app.config";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";

export function Topbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const current = appConfig.nav.find(
    (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-5 backdrop-blur">
      <h1 className="font-display text-lg font-semibold tracking-tight">
        {current ? t(current.label) : ""}
      </h1>
      <div className="ml-auto flex items-center gap-1.5">
        <LanguageToggle className="mr-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
