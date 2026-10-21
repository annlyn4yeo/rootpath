"use client";

import * as React from "react";

import { scrollTarget, stepTo } from "@/lib/smooth-scroll";

/** How long one step holds the page: about as long as a statement takes to roll in. */
const STEP_MS = 1000;
/** A pause this long between wheel events ends a gesture, so the next event starts a new one. */
const WHEEL_QUIET_MS = 200;
/** A steady wheel push this long after a step is a mouse wheel being spun, not trackpad inertia. */
const WHEEL_SUSTAIN_MS = 1400;
/** How far a finger travels before a swipe takes a step. */
const SWIPE_PX = 10;
/** Slack when comparing scroll positions with stops. */
const SLACK = 4;

const KEYS_DOWN = new Set(["ArrowDown", "PageDown"]);
const KEYS_UP = new Set(["ArrowUp", "PageUp"]);

function wheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/**
 * Makes scrolling rest at each of `stops` (offsets into `section`, in screens). One wheel gesture,
 * swipe or key press moves exactly one stop, so each statement can be read before the next one
 * replaces it. Past the last stop the page scrolls freely again, and scrolling back up comes to
 * rest on the last stop first. Dragging the scrollbar stays free.
 *
 * The listeners sit on `window` in the capture phase, ahead of the smooth-scroll library, so a
 * step can take an event over before anything else scrolls the page with it.
 */
export function useScrollStops(
  sectionRef: React.RefObject<HTMLElement | null>,
  stops: readonly number[],
) {
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Nothing scrolls under the boot intro: input is held until its curtain finishes lifting.
    let introPlaying = document.documentElement.dataset.intro === "play";
    const boot = document.querySelector<HTMLElement>(".hero-boot");
    const onBootEnd = (event: AnimationEvent) => {
      if (event.animationName === "boot-lift") introPlaying = false;
    };
    if (introPlaying) boot?.addEventListener("animationend", onBootEnd);

    let busyUntil = 0;
    let lastStepAt = -Infinity;
    // After a step, the rest of the same gesture (a trackpad's inertia) is swallowed.
    let swallowing = false;
    let lastWheelAt = -Infinity;
    let lastWheelSize = 0;
    let touch: { x: number; y: number; mode: "pending" | "steer" | "free"; stepped: boolean } | null =
      null;

    // Stop positions in page coordinates. Measured on resize rather than per wheel event, since
    // the listeners see every scroll on the page and a layout read each time adds up.
    let all: number[] = [];
    const measure = () => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      all = stops.map((stop) => Math.round(top + stop * window.innerHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    /** The stop a move from the current position lands on, or null to let the page scroll. */
    const destination = (direction: number, distance: number) => {
      const y = scrollTarget();
      const first = all[0];
      const last = all[all.length - 1];

      if (direction > 0) {
        if (y < first - SLACK) return y + distance >= first - SLACK ? first : null;
        return all.find((point) => point > y + SLACK) ?? null;
      }
      if (y > last + SLACK) return y - distance <= last + SLACK ? last : null;
      return [...all].reverse().find((point) => point < y - SLACK) ?? null;
    };

    const step = (target: number) => {
      const now = performance.now();
      busyUntil = now + STEP_MS;
      lastStepAt = now;
      swallowing = true;
      stepTo(target, STEP_MS / 1000);
    };

    const held = () => introPlaying || performance.now() < busyUntil;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const delta = wheelDelta(event);
      const size = Math.abs(delta);
      if (size === 0) return;

      const now = performance.now();
      const fresh =
        now - lastWheelAt > WHEEL_QUIET_MS ||
        size > lastWheelSize * 1.6 + 8 ||
        (now - lastStepAt > WHEEL_SUSTAIN_MS && size >= 20);
      lastWheelAt = now;
      lastWheelSize = size;

      const take = () => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };

      if (held()) {
        if (swallowing || introPlaying) take();
        return;
      }
      if (swallowing && !fresh) return take();
      swallowing = false;

      const target = destination(Math.sign(delta), size);
      if (target === null) return;
      take();
      step(target);
    };

    const onTouchStart = (event: TouchEvent) => {
      touch =
        event.touches.length === 1
          ? {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
              mode: "pending",
              stepped: false,
            }
          : null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touch || touch.mode === "free" || event.touches.length !== 1) return;
      const dy = touch.y - event.touches[0].clientY;
      const dx = touch.x - event.touches[0].clientX;

      if (touch.mode === "pending") {
        if (held()) {
          touch.mode = "steer";
        } else if (dy === 0 || Math.abs(dx) > Math.abs(dy)) {
          return;
        } else {
          // A swipe carries the page well past the finger, so project it most of a screen.
          const target = destination(Math.sign(dy), window.innerHeight * 0.75);
          touch.mode = target === null ? "free" : "steer";
        }
      }
      if (touch.mode !== "steer") return;
      if (event.cancelable) event.preventDefault();
      event.stopImmediatePropagation();

      if (!touch.stepped && !held() && Math.abs(dy) >= SWIPE_PX) {
        const target = destination(Math.sign(dy), window.innerHeight * 0.75);
        touch.stepped = true;
        if (target !== null) step(target);
      }
    };

    const onTouchEnd = () => {
      touch = null;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTyping(event.target)) return;

      let direction = 0;
      if (KEYS_DOWN.has(event.key)) direction = 1;
      else if (KEYS_UP.has(event.key)) direction = -1;
      else if (event.key === " ") {
        // Space on a focused control presses it.
        if (event.target instanceof HTMLElement && event.target.closest("a, button")) return;
        direction = event.shiftKey ? -1 : 1;
      }
      if (!direction) return;

      if (held()) {
        event.preventDefault();
        return;
      }
      const target = destination(direction, window.innerHeight * 0.85);
      if (target === null) return;
      event.preventDefault();
      step(target);
    };

    const capture = { capture: true, passive: false } as const;
    window.addEventListener("wheel", onWheel, capture);
    window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    window.addEventListener("touchmove", onTouchMove, capture);
    window.addEventListener("touchend", onTouchEnd, { capture: true, passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { capture: true, passive: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      boot?.removeEventListener("animationend", onBootEnd);
      observer.disconnect();
      window.removeEventListener("wheel", onWheel, capture);
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, capture);
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      window.removeEventListener("touchcancel", onTouchEnd, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [sectionRef, stops]);
}
