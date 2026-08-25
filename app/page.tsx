import { Capabilities } from "@/components/sections/capabilities";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
      </main>
      <Footer />
    </>
  );
}
