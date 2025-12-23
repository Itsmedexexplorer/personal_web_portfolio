"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";

const letterContainer = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
};

export function Hero() {
    const firstName = "DHANESH".split("");
    const lastName = "SHETTY".split("");

    return (
        <section id="home" className="relative w-full max-w-7xl mx-auto bg-paper-light min-h-[90vh] flex flex-col md:flex-row items-stretch">

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex flex-col justify-center px-8 md:px-16 pt-32 pb-12 md:pt-40 md:pb-20 z-10"
            >
                <h3 className="text-navy-700 font-merriweather text-xl md:text-2xl mb-2">
                    Hello, I am
                </h3>
                <h1 className="flex flex-col text-6xl md:text-8xl lg:text-9xl font-serif text-navy-700 leading-[0.85] tracking-tight mb-8">
                    <div className="flex overflow-hidden">
                        {firstName.map((letter, i) => (
                            <motion.span
                                key={i}
                                variants={letterContainer}
                                initial="initial"
                                animate="animate"
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="inline-block"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>
                    <div className="flex overflow-hidden">
                        {lastName.map((letter, i) => (
                            <motion.span
                                key={i}
                                variants={letterContainer}
                                initial="initial"
                                animate="animate"
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                                className="inline-block"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>
                </h1>

                <p className="font-merriweather text-navy-700/60 max-w-2xl text-lg md:text-xl leading-relaxed mb-8">
                    Inventing the Future with AI | CS Student @ NIAT | Builder • Innovator • Hackathon Winner | Exploring Agentic Intelligence & Human-AI Synergy
                </p>

                <div className="flex gap-4">
                    <Magnetic>
                        <button className="group flex items-center gap-3 px-8 py-3 rounded-full border border-navy-700/30 text-navy-700 font-merriweather hover:bg-navy-700 hover:text-white transition-all duration-300">
                            See My Projects
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </Magnetic>
                    <Magnetic>
                        <a href="#contact" className="flex items-center gap-3 px-6 py-3 rounded-full text-navy-700/60 font-merriweather hover:text-navy-700 hover:underline transition-all duration-300">
                            Contact / Hire Me
                        </a>
                    </Magnetic>
                </div>
            </motion.div>

            {/* Image Content */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 flex items-center justify-center mt-12 md:mt-0"
            >
                <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-navy-700/5">
                    <Image
                        src="/images/hero-portrait.png"
                        alt="Dhanesh Shetty"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </motion.div>

        </section>
    );
}
