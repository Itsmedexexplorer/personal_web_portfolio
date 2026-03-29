"use client";
import { motion } from "framer-motion";
import { CURRENT_ROLES } from "@/lib/data";

export function About() {
    return (
        <section id="about" className="relative w-full max-w-7xl mx-auto bg-[#FAFAFA] min-h-[80vh] flex flex-col items-center justify-center p-8 md:p-16 gap-12 scroll-mt-20">

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl"
            >
                <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">
                    What I Do
                </h2>
                <p className="font-sans text-neutral-600 text-lg leading-relaxed">
                    Bridging technical precision with human-centric innovation. <br className="hidden md:block" />
                    From leading tech communities to building AI-driven solutions.
                </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {CURRENT_ROLES.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white p-8 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3"
                    >
                        <span className="font-sans text-xs font-bold tracking-widest text-neutral-400 uppercase">
                            {item.type}
                        </span>
                        <h3 className="font-serif text-2xl text-neutral-900">
                            {item.role}
                        </h3>
                        <p className="font-sans text-neutral-600 text-base">
                            {item.organization}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
