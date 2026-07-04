import { Suspense } from "react";
import { SettingsClient } from "@/components/app/settings-client";

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsClient />
    </Suspense>
  );
}
