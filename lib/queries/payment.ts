import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type PaymentRequestRow =
  Database["public"]["Tables"]["payment_requests"]["Row"];

export interface AdminPaymentRequestRow extends PaymentRequestRow {
  user_email: string | null;
  user_full_name: string | null;
  /** Signed URL for the proof file, valid 1h. Null when proof_via != 'upload'. */
  proof_signed_url: string | null;
}

/**
 * Returns the current user's most recent payment requests (own only).
 * Used by /abonament to show "in review" / history.
 */
export async function getMyPaymentRequests(
  client: Client,
  limit = 10,
): Promise<PaymentRequestRow[]> {
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return [];

    const { data, error } = await client
      .from("payment_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("[payment] my requests fetch failed:", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

/**
 * Admin-only: returns all pending payment requests with the requester's
 * email + name (joined via profiles) and a signed URL for the proof.
 *
 * RLS lets admins SELECT all rows because of the
 * `payment_requests_select_admin` policy in migration 0007.
 */
export async function getPendingPaymentRequests(
  client: Client,
): Promise<AdminPaymentRequestRow[]> {
  const { data, error } = await client
    .from("payment_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[payment] admin pending fetch failed:", error.message);
    return [];
  }
  return enrichWithProfileAndProof(client, data ?? []);
}

export async function getReviewedPaymentRequests(
  client: Client,
  limit = 25,
): Promise<AdminPaymentRequestRow[]> {
  const { data, error } = await client
    .from("payment_requests")
    .select("*")
    .neq("status", "pending")
    .order("reviewed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[payment] admin reviewed fetch failed:", error.message);
    return [];
  }
  return enrichWithProfileAndProof(client, data ?? []);
}

async function enrichWithProfileAndProof(
  client: Client,
  rows: PaymentRequestRow[],
): Promise<AdminPaymentRequestRow[]> {
  if (rows.length === 0) return [];

  // Pull profiles for the unique user_ids in the result.
  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: profiles } = await client
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);
  const profileMap = new Map<string, { email: string; full_name: string }>();
  for (const p of profiles ?? []) {
    profileMap.set(p.id, { email: p.email, full_name: p.full_name });
  }

  // Sign proof URLs in parallel (1h).
  const enriched = await Promise.all(
    rows.map(async (r) => {
      let proof_signed_url: string | null = null;
      if (r.proof_via === "upload" && r.proof_path) {
        const { data } = await client.storage
          .from("payment-proofs")
          .createSignedUrl(r.proof_path, 60 * 60);
        proof_signed_url = data?.signedUrl ?? null;
      }
      const profile = profileMap.get(r.user_id);
      return {
        ...r,
        user_email: profile?.email ?? null,
        user_full_name: profile?.full_name ?? null,
        proof_signed_url,
      };
    }),
  );
  return enriched;
}
