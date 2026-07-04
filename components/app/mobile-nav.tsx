"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import appConfig from "@/app.config";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t, ui } = useLang();

  useEffect(() => setMounted(true), []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const drawer = open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col bg-sidebar text-sidebar-foreground shadow-pop">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
              <Logo onDark />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-11 w-11 place-items-center rounded-md text-sidebar-muted hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {appConfig.nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-active text-white shadow-sm"
                        : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    {t(item.label)}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-sidebar-border p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-foreground"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                {ui.logout}
              </button>
            </div>
          </div>
        </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Menu"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
