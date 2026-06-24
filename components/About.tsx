"use client";
import { motion } from "framer-motion";

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export function About() {
    return (
        <section id="about" className="relative w-full mx-auto bg-[#FAFAFA] min-h-[80vh] flex flex-col items-center py-24 px-6 md:px-12 scroll-mt-20">
            <div className="max-w-2xl w-full flex flex-col gap-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
                        What I Do
                    </h2>
                    <p className="font-sans text-neutral-600 text-lg">
                        I build. I lead. I ship.
                    </p>
                </motion.div>

                {/* Text Body */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-sans text-neutral-800 text-sm md:text-base leading-relaxed flex flex-col gap-6"
                >
                    <h3 className="font-serif font-bold text-lg md:text-xl text-neutral-900">Hey, I'm Dhanesh.</h3>
                    <p>
                        I build AI automations for real businesses  <br className="hidden sm:block" />
                        not side projects that die in localhost.
                    </p>
                    <p>
                        Co-founder of Nexa Tech. President of ADSA. <br />
                        Won the Ideathon by NIAT. <br />
                        Year 1. Already shipped 4+ live products.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* Dark Card - Left Column */}
                    <div className="bg-[#18181A] text-white p-6 md:p-8 rounded-[1.25rem] flex flex-col justify-between min-h-[220px] relative group cursor-pointer hover:scale-[1.02] transition-transform shadow-sm">
                        <div>
                            <span className="font-sans text-[10px] md:text-xs font-bold tracking-widest text-neutral-400 uppercase mb-3 block">Co-founder</span>
                            <h4 className="font-serif text-2xl md:text-3xl mb-1.5">Nexa Tech</h4>
                            <p className="text-sm text-neutral-400 font-medium">AI Automation Agency</p>
                        </div>
                        <ArrowUpRightIcon className="absolute bottom-6 right-6 text-neutral-500 group-hover:text-white transition-colors" />
                    </div>

                    {/* Right Column Stack */}
                    <div className="flex flex-col gap-4">
                        {/* Top Right Card */}
                        <div className="bg-white p-6 rounded-[1.25rem] border border-neutral-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all flex-1">
                            <div>
                                <span className="font-sans text-[10px] md:text-xs font-bold tracking-widest text-neutral-400 uppercase mb-2 block">Leadership</span>
                                <h4 className="font-serif text-xl mb-1 text-neutral-900">President, ADSA</h4>
                                <p className="text-xs md:text-sm text-neutral-500 font-medium">200+ students</p>
                            </div>
                            <ArrowUpRightIcon className="absolute bottom-6 right-6 text-neutral-400 group-hover:text-black transition-colors" />
                        </div>

                        {/* Bottom Right Card */}
                        <div className="bg-white p-6 rounded-[1.25rem] border border-neutral-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all flex-1">
                            <div>
                                <span className="font-sans text-[10px] md:text-xs font-bold tracking-widest text-neutral-400 uppercase mb-2 block">Hackathon Win 🏆</span>
                                <h4 className="font-serif text-xl mb-1 text-neutral-900">Ideathon by NIAT</h4>
                                <p className="text-xs md:text-sm text-neutral-500 font-medium">1st Place</p>
                            </div>
                            <ArrowUpRightIcon className="absolute bottom-6 right-6 text-neutral-400 group-hover:text-black transition-colors" />
                        </div>
                    </div>

                    {/* Bottom Card - Full Width */}
                    <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[1.25rem] border border-neutral-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between relative group cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all">
                        <div>
                            <span className="font-sans text-[10px] md:text-xs font-bold tracking-widest text-neutral-400 uppercase mb-3 block">Academic</span>
                            <h4 className="font-serif text-2xl mb-1 text-neutral-900">B.Tech AI & DS</h4>
                            <p className="text-sm text-neutral-500 font-medium">NIAT Kolhapur</p>
                        </div>
                        <ArrowUpRightIcon className="absolute bottom-6 right-6 text-neutral-400 group-hover:text-black transition-colors" />
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="w-full mt-2"
                >
                    <a
                        href="#projects"
                        className="w-full bg-[#18181A] text-white px-8 py-4 md:py-5 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] hover:bg-black shadow-md flex items-center justify-center gap-3 text-base md:text-lg group"
                    >
                        Explore My Work
                        <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
