"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { gateway, isCardCheckoutEnabled } from "@/lib/payments";

export type DeleteAccountResult = { ok: false; error: string } | { ok: true };

/**
 * Deletes the caller's account and everything tied to it.
 *
 * Any live subscription is cancelled at the provider first (immediately —
 * the account is going away, so there is no paid period to preserve), then the
 * auth user is deleted with the service role. Every table that references
 * auth.users does so with ON DELETE CASCADE, so profile, course access and
 * payment rows go with it.
 *
 * On success the browser is redirected to the signed-out home page.
 */
export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  if (!isSupabaseConfigured || !isServiceRoleConfigured) {
    return { ok: false, error: "Ștergerea nu e disponibilă momentan." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sesiunea a expirat. Re-loghează-te." };
  }

  // Best-effort: cancel any active subscription so the card is not charged
  // again after the account is gone. A failure here must not block deletion.
  if (isCardCheckoutEnabled && user.email) {
    try {
      const customerId = await gateway.findCustomerIdByEmail(user.email);
      if (customerId) {
        const subs = await gateway.listActiveSubscriptions(customerId);
        for (const sub of subs) {
          await gateway.cancelSubscription(sub.id, "immediate");
        }
      }
    } catch (err) {
      console.warn("[account] subscription cancel during delete failed:", err);
    }
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.warn("[account] delete failed:", error.message);
    return { ok: false, error: "Nu am putut șterge contul. Reîncearcă." };
  }

  // Clear the now-orphaned session cookie, then leave.
  await supabase.auth.signOut().catch(() => {});
  redirect("/?deleted=1");
}
