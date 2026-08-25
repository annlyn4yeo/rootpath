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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between lg:h-[4.5rem]">
          <a
            href="#top"
            aria-label="RootPath home"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.2em] text-foreground"
          >
            ROOTPATH
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          </a>

          <nav
            aria-label="Primary navigation"
            onMouseLeave={() => setHoveredItem(null)}
            className="hidden items-center gap-7 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.label)}
                onFocus={() => setHoveredItem(item.label)}
                onBlur={() => setHoveredItem(null)}
                className="relative py-2 text-sm text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                {hoveredItem === item.label ? (
                  <motion.span
                    layoutId="hover-pill"
                    className="absolute inset-x-0 bottom-0 h-px bg-accent"
                    transition={shouldReduceMotion ? { duration: 0 } : spring}
                  />
                ) : null}
                <span>{item.label}</span>
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
              className="rounded-lg border border-border-strong px-3 py-2 text-xs font-medium text-foreground outline-none transition-colors duration-150 ease-out hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
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
              className="border-t border-border px-6 py-3 md:hidden"
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
