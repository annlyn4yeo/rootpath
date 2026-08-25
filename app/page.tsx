import { Capabilities } from "@/components/sections/capabilities";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <Process />
      </main>
      <Footer />
    </>
  );
}
