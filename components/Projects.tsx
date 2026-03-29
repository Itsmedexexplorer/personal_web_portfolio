"use client";
import StackingCards from "@/components/ui/stacking-cards";


import { PROJECTS } from "@/lib/data";

export function Projects() {
    return (
        <section id="projects" className="w-full bg-[#FAFAFA]">
            <StackingCards
                projects={PROJECTS}
                title="Selected Works"
                description="A curated collection of projects that define my approach to digital product design."
            />

            <div className="pb-24 pt-12 flex justify-center bg-[#FAFAFA]">
                <button className="group text-neutral-500 font-sans font-medium hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
                    View All Archives
                    <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-2">→</span>
                </button>
            </div>
        </section>
    );
}
