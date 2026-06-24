import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { ResumeRequest } from "@/components/ResumeRequest";

export default function Home() {
  return (
    <main className="w-full bg-paper-light">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <ResumeRequest />
      <Contact />
    </main>
  );
}
