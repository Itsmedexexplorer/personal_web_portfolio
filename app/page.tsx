import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="w-full bg-paper-light">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
    </main>
  );
}
