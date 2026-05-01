"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Inertial smooth scroll — applies once at app root.
 *
 * On route change we DON'T tear Lenis down (it lives in the root layout, so
 * the React tree above survives). Instead we:
 *   1. scrollTo(0, immediate) — Next won't scroll-restore on its own when a
 *      smooth-scroll lib has hijacked wheel events.
 *   2. lenis.resize() — Lenis caches scrollHeight at mount; client-side nav
 *      swaps page content and the cached size goes stale, which is why
 *      scroll appeared "frozen" until a hard refresh.
 *
 * Disables itself on prefers-reduced-motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    // Defer resize() one frame so the new page's DOM is fully laid out before
    // Lenis reads scrollHeight — otherwise we'd capture the previous page's
    // height during the swap.
    const id = requestAnimationFrame(() => lenis.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
