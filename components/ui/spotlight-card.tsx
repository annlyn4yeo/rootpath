"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

const hoverSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.7,
};

interface SpotlightCardProps {
  "aria-label"?: string;
  children: React.ReactNode;
  className?: string;
  onHoverEnd?: () => void;
  onHoverStart?: () => void;
}

export function SpotlightCard({
  "aria-label": ariaLabel,
  children,
  className,
  onHoverEnd,
  onHoverStart,
}: SpotlightCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const pointerX = useMotionValue(-1000);
  const pointerY = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${pointerX}px ${pointerY}px, rgb(var(--accent-rgb) / 0.12), transparent 44%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
  };

  const resetSpotlight = () => {
    pointerX.set(-1000);
    pointerY.set(-1000);
  };

  return (
    <motion.article
      aria-label={ariaLabel}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetSpotlight}
      whileHover={shouldReduceMotion ? undefined : { transform: "translateY(-4px)" }}
      transition={hoverSpring}
      className={cn(
        "relative isolate overflow-hidden rounded-xl border border-border bg-surface-elevated",
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotlight }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.article>
  );
}
