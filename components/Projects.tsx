"use client";
import StackingCards from "@/components/ui/stacking-cards";
import { Magnetic } from "@/components/ui/Magnetic";

const projects = [
    {
        title: "Fintech Dashboard",
        description: "A comprehensive dashboard for tracking financial metrics, featuring real-time data visualization and intuitive user flows. (UI/UX Design • 2024)",
        link: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        color: "#16213e", // Navy
    },
    {
        title: "E-Commerce App",
        description: "Mobile-first shopping experience optimized for conversion. Includes gesture-based navigation and seamless checkout. (Mobile Design • 2023)",
        link: "https://images.unsplash.com/photo-1472851294608-415522f96319?q=80&w=800&auto=format&fit=crop",
        color: "#c35e3d", // Rust
    },
    {
        title: "Travel Brand Identity",
        description: "Complete visual identity system including logo usage, typography, and color palette for a luxury travel agency. (Branding • 2023)",
        link: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
        color: "#262626", // Neutral
    },
    {
        title: "Health Tracker",
        description: "Cross-platform application for monitoring daily health stats. Focus on accessibility and dark mode support. (Product Design • 2022)",
        link: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        color: "#57534e", // Stone
    }
];

export function Projects() {
    return (
        <section id="projects" className="w-full bg-paper-light">
            <StackingCards
                projects={projects}
                title="Selected Works"
                description="A curated collection of projects that define my approach to digital product design."
            />

            <div className="pb-24 pt-12 flex justify-center bg-paper-light">
                <Magnetic>
                    <button className="px-8 py-4 border border-navy-700/20 rounded-full font-merriweather text-navy-700 hover:bg-navy-700 hover:text-white transition-colors">
                        View All Archives
                    </button>
                </Magnetic>
            </div>
        </section>
    );
}
