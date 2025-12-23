"use client";
import { ExpandOnHover } from "@/components/ui/expand-cards";
import { motion } from "framer-motion";

const certifications = [
    {
        id: 1,
        title: "AWS Architect",
        category: "Cloud Computing",
        year: "2024",
        color: "bg-[#232F3E]", // AWS
    },
    {
        id: 2,
        title: "Google UX",
        category: "Design",
        year: "2023",
        color: "bg-[#4285F4]", // Google
    },
    {
        id: 3,
        title: "Meta Frontend",
        category: "Development",
        year: "2023",
        color: "bg-[#0668E1]", // Meta
    },
    {
        id: 4,
        title: "Hackathon Win",
        category: "Achievement",
        year: "2023",
        color: "bg-navy-900", // Dark
    },
];

export function Certifications() {
    return (
        <section id="certifications" className="scroll-mt-32 w-full max-w-7xl mx-auto py-20 px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8 text-center"
            >
                <h1 className="text-5xl md:text-7xl font-serif text-navy-700 mb-6">
                    Credentials
                </h1>
                <p className="font-merriweather text-navy-700/60 max-w-xl mx-auto text-lg">
                    Professional certifications and achievements
                </p>
            </motion.div>

            <ExpandOnHover items={certifications} />
        </section>
    );
}
