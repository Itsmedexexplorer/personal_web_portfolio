import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="w-full bg-paper-light">
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Contact />
    </main>
  );
}
