"use client";

import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
  mass: 0.8,
};

const heroItem = {
  hidden: { opacity: 0, transform: "translateY(18px)" },
  visible: { opacity: 1, transform: "translateY(0)" },
};

const capabilities = [
  "Web development",
  "Mobile apps",
  "Cloud infrastructure",
] as const;

export function Hero() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const scrollToFooter = () => {
    document
      .getElementById("footer")
      ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const reveal = (delay: number) => ({
    variants: heroItem,
    initial: shouldReduceMotion ? false : "hidden",
    animate: "visible",
    transition: { ...spring, delay },
  });

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="mx-auto grid max-w-7xl items-start gap-14 border-b border-border px-6 pb-24 pt-20 sm:gap-16 sm:pb-28 sm:pt-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.55fr)] lg:gap-20 lg:px-10 lg:pb-32 lg:pt-28"
    >
      <div>
        <motion.p
          {...reveal(0)}
          className="mb-7 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-subtle"
        >
          RootPath / digital engineering
        </motion.p>

        <motion.h1
          id="hero-heading"
          {...reveal(0.08)}
          className="max-w-5xl text-[clamp(3.5rem,6.8vw,6.75rem)] font-medium leading-[0.92] tracking-[-0.085em] text-foreground"
        >
          <span className="block">Small team. Direct access.</span>
          <span className="mt-3 block text-accent">Faster decisions.</span>
        </motion.h1>

        <motion.p
          {...reveal(0.16)}
          className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
        >
          Web, mobile, cloud, and technical strategy. Direct collaboration,
          focused scope, and fast delivery.
        </motion.p>

        <motion.div
          {...reveal(0.24)}
          className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
        >
          <Button size="lg" onClick={scrollToFooter}>
            Start a project
          </Button>
          <motion.a
            href="#services"
            whileHover={shouldReduceMotion ? undefined : "hover"}
            variants={{ rest: {}, hover: {} }}
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            Explore services
            <motion.span
              aria-hidden="true"
              variants={{
                rest: { transform: "translateX(0)" },
                hover: { transform: "translateX(5px)" },
              }}
              transition={spring}
              className="text-accent"
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>

      <motion.aside
        {...reveal(0.18)}
        aria-label="RootPath capabilities"
        className="border-t border-accent/40 pt-8 lg:mt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-subtle">
          Close to the work
        </p>
        <p className="mt-5 max-w-xs text-lg leading-7 tracking-[-0.02em] text-foreground">
          Fewer handoffs. Direct access to the people making the decisions.
        </p>

        <div className="mt-8 border-t border-border">
          {capabilities.map((capability) => (
            <div
              key={capability}
              className="flex items-center justify-between border-b border-border py-4 text-sm text-muted-foreground"
            >
              <span>{capability}</span>
              <span aria-hidden="true" className="text-muted-subtle">
                /
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-xs text-muted-subtle">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-accent"
          />
          Direct collaboration
        </div>
      </motion.aside>
    </section>
  );
}
