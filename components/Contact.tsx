"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function Contact() {
    return (
        <section id="contact" className="relative w-full max-w-7xl mx-auto bg-paper-light overflow-hidden min-h-screen flex flex-col items-center justify-center p-8 md:p-16 text-center">

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl flex flex-col items-center"
            >
                <h3 className="font-merriweather text-rust-500 text-lg md:text-xl tracking-wider uppercase mb-6">
                    Contact functionality
                </h3>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-navy-700 leading-tight mb-12">
                    Let&apos;s work <br /> together.
                </h1>

                <Link
                    href="mailto:hello@coleadrian.design"
                    className="text-2xl md:text-4xl font-merriweather text-navy-700 border-b-2 border-navy-700/20 hover:border-rust-500 hover:text-rust-500 transition-all pb-1 mb-16"
                >
                    hello@coleadrian.design
                </Link>

                <div className="flex flex-wrap gap-8 md:gap-16 justify-center">
                    {['Twitter', 'LinkedIn', 'Instagram', 'Dribbble'].map((social) => (
                        <Link
                            key={social}
                            href="#"
                            className="font-merriweather text-navy-700/60 hover:text-navy-700 transition-colors text-lg"
                        >
                            {social}
                        </Link>
                    ))}
                </div>
            </motion.div>

        </section>
    );
}
