"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section id="home" className="relative w-full max-w-7xl mx-auto bg-[#FAFAFA] min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 pt-32 pb-12 md:py-20">
            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center z-10 max-w-2xl">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-serif italic text-2xl md:text-3xl text-neutral-500 mb-6"
                >
                    Hello, I am
                </motion.h3>

                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-neutral-900 leading-[0.9] tracking-tight mb-8">
                    <motion.span
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="block"
                    >
                        Dhanesh
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="block text-neutral-800"
                    >
                        Shetty
                    </motion.span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="font-sans text-neutral-600 text-lg md:text-xl leading-relaxed mb-12 max-w-lg"
                >
                    Inventing the Future with AI. <br />
                    CS Student @ NIAT & Builder. <br />
                    Exploring Agentic Intelligence & Human-AI Synergy.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex gap-6"
                >
                    <a href="#projects" className="border-b border-black pb-1 text-black hover:opacity-60 transition-opacity font-medium">
                        See My Projects
                    </a>
                    <a href="#contact" className="border-b border-transparent pb-1 text-neutral-500 hover:text-black hover:border-black transition-all">
                        Contact Me
                    </a>
                </motion.div>
            </div>

            {/* Image Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="flex-1 flex items-center justify-end mt-12 md:mt-0"
            >
                <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[600px] grayscale hover:grayscale-0 transition-all duration-700">
                    <Image
                        src="/images/hero-portrait.png"
                        alt="Dhanesh Shetty"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
}
