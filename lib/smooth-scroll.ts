import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** The active smooth-scroll instance, or null when it is off (reduced motion, before mount). */
function getLenis() {
  return instance;
}

/** Ease in and out, so a jump accelerates away and settles gently onto its target. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Distance from the top of the document to the element's layout box. Uses offsetTop
 * rather than getBoundingClientRect, so scroll-linked transforms (sections that rise or
 * scale in as they enter) never shift where a jump lands.
 */
function layoutTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Glides an element to the top of the viewport, below the sticky navbar
 * (`scroll-padding-top` on <html>, adjusted by the element's own `scroll-margin-top`, which
 * pinned sections use to land flush with the top). Longer jumps take a little longer, so
 * every section transition along the way plays out instead of flashing past.
 */
export function scrollToElement(element: HTMLElement) {
  const padding =
    Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;
  const margin =
    Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  scrollToY(layoutTop(element) - padding - margin);
}

/** Glides the page to an absolute scroll position, with the same pacing as `scrollToElement`. */
function scrollToY(target: number) {
  const top = Math.max(0, target);
  const lenis = getLenis();

  if (lenis) {
    const distance = Math.abs(top - window.scrollY);
    lenis.scrollTo(top, {
      duration: Math.min(2.4, 0.8 + distance / 2800),
      easing: easeInOutCubic,
    });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Fast away, long settle: a step answers the input at once and eases onto its stop. */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

/** Where the page is heading: the smooth-scroll target while one is running, else where it is. */
export function scrollTarget() {
  return getLenis()?.targetScroll ?? window.scrollY;
}

/**
 * Moves the page to a scroll stop and holds other scrolling off until it lands, for scroll that
 * advances in fixed steps.
 */
export function stepTo(target: number, duration: number) {
  const top = Math.max(0, target);
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(top, {
      duration,
      easing: easeOutQuart,
      lock: true,
      force: true,
    });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
