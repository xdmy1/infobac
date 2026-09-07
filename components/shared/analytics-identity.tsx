"use client";

import { useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { identifyUser, resetIdentity, track } from "@/lib/analytics/events";

/**
 * Attaches the signed-in user to everything this browser has already done.
 *
 * Until this runs, a visitor is an anonymous id: pages read, links followed,
 * time spent. `identify` merges that history into the person, which is the
 * only reason we can answer "what were they looking at before they made an
 * account" — the events happened long before the account existed.
 *
 * Renders nothing. Mounted once in the root layout so it covers the marketing
 * site and the app alike.
 */
export function AnalyticsIdentity() {
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        identifyUser(data.user.id, {
          email: data.user.email ?? undefined,
          name: data.user.user_metadata?.full_name as string | undefined,
        });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // Otherwise the next person on a shared school computer inherits this
        // one's identity, and both journeys become nonsense.
        resetIdentity();
        return;
      }
      if (session?.user) {
        // Fired here rather than in the login form: loginAction finishes with
        // a server-side redirect, and Google sign-in never touches that form
        // at all. Every way in passes through this callback.
        if (event === "SIGNED_IN") track("login_completed", {});
        identifyUser(session.user.id, {
          email: session.user.email ?? undefined,
          name: session.user.user_metadata?.full_name as string | undefined,
        });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return null;
}
