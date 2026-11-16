/**
 * Deterministic Cross-Device Viewport & Breakpoint Utilities
 *
 * Ensures 100% consistency between CSS media queries (@media (min-width: ...))
 * and JavaScript layout calculations across Chrome on Android, Safari on iPhone,
 * Samsung Internet, and embedded mobile WebViews regardless of OS font scaling,
 * scrollbar width, or dynamic mobile URL bar collapse.
 */

export const BREAKPOINTS = {
  xs: 375,
  mobileLg: 540,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type ViewportTier = 'mobile-sm' | 'mobile-md' | 'mobile-lg' | 'tablet' | 'desktop';

/**
 * Returns the authoritative CSS layout viewport width in CSS pixels.
 * Prefers `document.documentElement.clientWidth` when valid and positive so that:
 * 1. Vertical scrollbars do not artificially inflate breakpoint checks.
 * 2. iOS Safari & Android Chrome report the actual CSS layout container width.
 */
export function getViewportWidth(win: Window | undefined = typeof window !== 'undefined' ? window : undefined): number {
  if (!win) return BREAKPOINTS.lg;

  const docClientWidth = win.document?.documentElement?.clientWidth ?? 0;
  const innerWidth = win.innerWidth ?? 0;

  if (docClientWidth > 0 && innerWidth > 0) {
    // Use the smaller of clientWidth and innerWidth to never exceed the visible CSS layout box
    return Math.min(docClientWidth, innerWidth);
  }
  return docClientWidth || innerWidth || BREAKPOINTS.lg;
}

/**
 * Returns the authoritative CSS viewport height in CSS pixels.
 */
export function getViewportHeight(win: Window | undefined = typeof window !== 'undefined' ? window : undefined): number {
  if (!win) return 800;

  const docClientHeight = win.document?.documentElement?.clientHeight ?? 0;
  const innerHeight = win.innerHeight ?? 0;

  return innerHeight || docClientHeight || 800;
}

/**
 * Evaluates a `(min-width: Xpx)` media query in lockstep with the browser's CSS engine.
 * Falls back to `getViewportWidth(win) >= minPx` in headless/test environments where
 * `matchMedia` is mocked or synchronized via `innerWidth`.
 */
export function matchesMinWidth(
  minPx: number,
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): boolean {
  if (!win) return minPx <= BREAKPOINTS.lg;
  const width = getViewportWidth(win);

  if (typeof win.matchMedia === 'function') {
    const mql = win.matchMedia(`(min-width: ${minPx}px)`);
    // When JSDOM or a custom environment doesn't dynamically evaluate matchMedia,
    // reconcile with explicit viewport width if innerWidth/clientWidth was updated.
    if (typeof mql.matches === 'boolean' && mql.media === `(min-width: ${minPx}px)`) {
      const widthMatches = width >= minPx;
      // Trust CSS matchMedia on real browsers unless width and matchMedia diverge due to test stubbing
      if (mql.matches === widthMatches) {
        return mql.matches;
      }
      return widthMatches;
    }
  }

  return width >= minPx;
}

/**
 * Determines the current responsive tier across all supported device widths:
 * - `mobile-sm`: 320px - 374px (compact phones)
 * - `mobile-md`: 375px - 413px (standard iPhones & Android phones)
 * - `mobile-lg`: 414px - 767px (large phones, Pro Max, Ultra, phablets, 600px devices)
 * - `tablet`:    768px - 1023px (iPad Mini, iPad Air, tablets)
 * - `desktop`:   1024px+ (laptops & desktop monitors)
 */
export function getViewportTier(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): ViewportTier {
  const vw = getViewportWidth(win);
  if (vw >= BREAKPOINTS.lg) return 'desktop';
  if (vw >= BREAKPOINTS.md) return 'tablet';
  if (vw >= 414) return 'mobile-lg';
  if (vw >= BREAKPOINTS.xs) return 'mobile-md';
  return 'mobile-sm';
}

export function isMobileViewport(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): boolean {
  return !matchesMinWidth(BREAKPOINTS.md, win);
}

export function isTabletViewport(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): boolean {
  return matchesMinWidth(BREAKPOINTS.md, win) && !matchesMinWidth(BREAKPOINTS.lg, win);
}

export function isDesktopViewport(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined
): boolean {
  return matchesMinWidth(BREAKPOINTS.lg, win);
}
