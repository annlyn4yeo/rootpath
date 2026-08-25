"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#footer" },
] as const;

const spring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.7,
};

export function Navbar() {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const closeMobileMenu = () => setMobileOpen(false);
  const scrollToFooter = () => {
    document
      .getElementById("footer")
      ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <header className="sticky top-3 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-7xl sm:top-4 sm:w-[calc(100%-2rem)]">
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface-elevated/85 shadow-[0_10px_40px_rgb(var(--shadow-rgb)/0.08)] backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
          <a
            href="#top"
            aria-label="RootPath home"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-foreground"
          >
            ROOTPATH
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          </a>

          <nav
            aria-label="Primary navigation"
            onMouseLeave={() => setHoveredItem(null)}
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.label)}
                onFocus={() => setHoveredItem(item.label)}
                onBlur={() => setHoveredItem(null)}
                className="relative rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                {hoveredItem === item.label ? (
                  <motion.span
                    layoutId="hover-pill"
                    className="absolute inset-0 rounded-md bg-surface"
                    transition={shouldReduceMotion ? { duration: 0 } : spring}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={scrollToFooter}
              className="hidden md:inline-flex"
            >
              Start a project
            </Button>
            <motion.button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((open) => !open)}
              whileTap={
                shouldReduceMotion ? undefined : { transform: "scale(0.96)" }
              }
              transition={spring}
              className="rounded-md border border-border-strong px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
            >
              Menu
            </motion.button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen ? (
            <motion.nav
              id="mobile-navigation"
              key="mobile-navigation"
              aria-label="Mobile navigation"
              initial={shouldReduceMotion ? false : { opacity: 0, transform: "translateY(-8px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, transform: "translateY(-8px)" }}
              transition={spring}
              className="border-t border-border px-4 py-3 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block border-b border-border py-3 text-sm text-muted-foreground outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  {item.label}
                </a>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
