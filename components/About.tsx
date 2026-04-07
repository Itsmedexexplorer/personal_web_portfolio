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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl">
                {/* Big Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-5 bg-white p-8 md:p-10 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-center gap-6"
                >
                    <h3 className="font-serif text-3xl md:text-4xl text-neutral-900">
                        About Me
                    </h3>
                    <p className="font-sans text-neutral-600 text-base md:text-lg leading-relaxed">
                        Hi, I&apos;m Dhanesh. As an Artificial Intelligence and Data Science student and President of my department, I specialize in bridging the gap between intelligent backend models and responsive frontend design. My portfolio features a range of &apos;Selected Works&apos;—from custom AI assistants for PC automation to full-stack web architectures. Recently, I led a team to win the Ideathon By NIAT, which fueled my passion for building secure, dynamic applications that solve real-world problems through AI automation.
                    </p>
                </motion.div>

                {/* 4 Roles - right side */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {CURRENT_ROLES.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3"
                        >
                            <span className="font-sans text-xs font-bold tracking-widest text-neutral-400 uppercase">
                                {item.type}
                            </span>
                            <h3 className="font-serif text-xl md:text-2xl text-neutral-900 leading-tight">
                                {item.role}
                            </h3>
                            <p className="font-sans text-neutral-600 text-sm md:text-base">
                                {item.organization}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
