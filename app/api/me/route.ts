import { NextResponse } from "next/server";
import { getAuthUser, getCredits } from "@/lib/credits";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getCredits(user.id);
  return NextResponse.json({ credits: profile?.credits ?? 0, plan: profile?.plan ?? "solo" });
}
