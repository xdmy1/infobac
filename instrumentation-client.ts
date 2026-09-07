import posthog from "posthog-js";

/**
 * Analytics bootstrap. Next runs this after the document loads but before
 * React hydrates, so the first pageview and its referrer are captured even if
 * the visitor leaves immediately.
 *
 * What it is here to answer: which link or search brought someone in, which
 * page they landed on, where they went next, how long they stayed, what they
 * were looking at when they decided to create an account, and what they did
 * afterwards. Most of that is automatic — pageviews, pageleave (which is what
 * turns into time-on-page), referrer, UTM tags and autocaptured clicks. The
 * named events in lib/analytics/events.ts cover the moments that matter for
 * money, which are the ones worth being explicit about.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/** Set by the opt-out control in the privacy policy. Also read by the GA bootstrap. */
function hasOptedOut(): boolean {
  try {
    return localStorage.getItem("analytics-opt-out") === "1";
  } catch {
    return false;
  }
}

if (key) {
  posthog.init(key, {
    // Same-origin, proxied in next.config.ts. Never point this at PostHog
    // directly: ad blockers drop those requests and the funnel silently
    // loses the visitors most likely to be worth understanding.
    api_host: "/ingest",
    // Links inside the PostHog UI still need the real host.
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",

    // Anonymous visitors get a profile too. The whole question is what people
    // do *before* they sign up — and for the ones who never do — so their
    // events need to hang together as one person rather than float free.
    person_profiles: "always",

    // A pageview per pathname change (the App Router never reloads), and a
    // pageleave on the way out so each page has a duration.
    capture_pageview: "history_change",
    capture_pageleave: true,

    session_recording: {
      // Every input value is redacted before it leaves the browser: emails,
      // passwords, card fields, quiz answers. Replay is here to show which
      // element someone clicked and where they got stuck, not what they typed.
      maskAllInputs: true,
      // Anything explicitly marked as sensitive is masked as rendered text too.
      maskTextSelector: "[data-private]",
    },
  });

  if (hasOptedOut()) {
    posthog.opt_out_capturing();
  }
}
