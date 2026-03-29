"use client";
import { ExpandOnHover } from "@/components/ui/expand-cards";
import { motion } from "framer-motion";
import { CERTIFICATIONS } from "@/lib/data";

export function Certifications() {
    return (
        <section id="certifications" className="scroll-mt-32 w-full max-w-7xl mx-auto py-20 px-8 bg-[#FAFAFA]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">
                    Credentials
                </h1>
                <p className="font-sans text-neutral-500 max-w-xl mx-auto text-lg">
                    Professional certifications and achievements
                </p>
            </motion.div>

            <ExpandOnHover items={CERTIFICATIONS} />
        </section>
    );
}
