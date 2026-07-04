import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export async function deductCredits(userId: string, amount: number): Promise<{ ok: boolean; remaining: number }> {
  const admin = await createAdminClient();
  const { data, error } = await admin.rpc("deduct_credits", { p_user_id: userId, p_amount: amount });
  if (error) {
    console.error("[credits] deduct_credits error:", error);
    return { ok: false, remaining: 0 };
  }
  const remaining = data as number;
  if (remaining === -1) return { ok: false, remaining: 0 };
  return { ok: true, remaining };
}

export async function getCredits(userId: string): Promise<{ credits: number; plan: string } | null> {
  const admin = await createAdminClient();
  const { data } = await admin.from("profiles").select("credits, plan").eq("id", userId).single();
  return data ?? null;
}
