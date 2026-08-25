const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#footer" },
] as const;

const techStack = ["Next.js", "React", "React Native", "AWS", "GraphQL"] as const;

export function Footer() {
  return (
    <footer id="footer" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr_1fr] lg:gap-12">
          <div className="max-w-md">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-foreground"
            >
              ROOTPATH
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              RootPath is a lean digital engineering team for web development,
              mobile apps, cloud infrastructure, and technical strategy.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-subtle">
              Explore
            </p>
            <nav aria-label="Footer navigation" className="mt-5 grid gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-subtle">
              Built with
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {techStack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-border-strong bg-surface-elevated/50 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-subtle sm:flex-row sm:items-center sm:justify-between lg:mt-12">
          <p>Lean team / direct collaboration</p>
          <p>RootPath</p>
        </div>
      </div>
    </footer>
  );
}
