import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto grid min-h-[100dvh] max-w-7xl items-end gap-16 px-6 pb-8 pt-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:px-10">
      <section className="max-w-3xl">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          RootPath / digital systems
        </p>
        <h1 className="max-w-[12ch] text-5xl font-medium tracking-[-0.07em] text-foreground sm:text-6xl lg:text-8xl lg:leading-[0.94]">
          Digital work with a clear direction.
        </h1>
        <p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground">
          Websites, mobile apps, and enterprise platforms built for teams
          moving the world forward.
        </p>
        <div className="mt-10">
          <Button>Start a conversation</Button>
        </div>
      </section>

      <aside className="max-w-sm border-l border-border pl-6 text-sm leading-6 text-muted-foreground lg:mb-4">
        RootPath partners with ambitious teams to turn complex ideas into
        clear, high-performing digital experiences.
      </aside>
    </main>
  );
}
