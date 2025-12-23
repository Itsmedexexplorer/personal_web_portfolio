"use client";
import { motion } from "framer-motion";

import Image from "next/image";

export function About() {
    return (
        <section id="about" className="relative w-full max-w-7xl mx-auto bg-paper-light overflow-hidden min-h-screen flex flex-col md:flex-row items-center p-8 md:p-16 gap-12 scroll-mt-32">

            {/* Image/Visual Side */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full flex justify-center"
            >
                <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-navy-700/5">
                    <Image
                        src="/assets/about_me_custom.jpg"
                        alt="Dhanesh Shetty"
                        fill
                        className="object-cover hover:scale-105 transition-all duration-700"
                    />
                </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 flex flex-col gap-8"
            >
                <div>
                    <h1 className="text-5xl md:text-7xl font-serif text-navy-700 mb-6">
                        About Me
                    </h1>
                    <h3 className="text-xl font-merriweather text-rust-500 mb-4">
                        Product Designer & Visual Storyteller
                    </h3>
                    <div className="w-20 h-1 bg-navy-700/10 mb-8" />

                    <p className="font-merriweather text-navy-700/80 text-lg leading-relaxed mb-6">
                        I am Dhanesh Shetty, currently pursuing my studies at NIAT Kolhapur in collaboration with Sanjay Ghodawat University. My approach to engineering bridges the gap between technical precision and human-centric innovation.
                    </p>
                    <p className="font-merriweather text-navy-700/80 text-lg leading-relaxed">
                        Beyond traditional software development, I am deeply invested in exploring and creating AI solutions, automating complex workflows, and building intuitive products. I view code not just as functional instructions, but as a framework for solving real-world problems—constantly researching and refining systems to be as robust behind the scenes as they are effortless for the user.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4">
                    <div>
                        <h4 className="font-serif text-2xl text-navy-700 mb-2">5+</h4>
                        <p className="font-merriweather text-sm text-navy-700/60 uppercase tracking-widest">Years Experience</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-2xl text-navy-700 mb-2">50+</h4>
                        <p className="font-merriweather text-sm text-navy-700/60 uppercase tracking-widest">Projects Completed</p>
                    </div>
                </div>
            </motion.div>

        </section>
    );
}
