"use client";

import { usePathname } from "next/navigation";
import appConfig from "@/app.config";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { MobileNav } from "@/components/app/mobile-nav";
import { useLang } from "@/components/i18n/language-provider";

export function Topbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const current = appConfig.nav.find(
    (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:gap-4 sm:px-5">
      <MobileNav />
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
