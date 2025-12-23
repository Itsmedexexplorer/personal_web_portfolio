"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectItem {
    id: number;
    title: string;
    category: string;
    year: string;
    color: string;
}

export function ExpandOnHover({ items }: { items: ProjectItem[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const images = [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    ];

    if (isMobile) {
        return (
            <div className="flex flex-col gap-4 w-full px-4">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`relative w-full h-[300px] rounded-3xl overflow-hidden shadow-lg border border-navy-700/5 ${item.color}`}
                    >
                        <Image
                            src={images[idx % images.length]}
                            alt={item.title}
                            fill
                            className="object-cover opacity-60 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white bg-gradient-to-t from-black/50 to-transparent">
                            <p className="text-sm font-merriweather uppercase tracking-widest opacity-80 mb-1">{item.category}</p>
                            <h3 className="text-3xl font-serif mb-1">{item.title}</h3>
                            <p className="text-sm opacity-60">{item.year}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center py-10 px-4">
            <div className="flex w-full max-w-7xl items-center justify-center gap-2 h-[500px]">
                {items.map((item, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const flexValue = isHovered ? 3.5 : 1;

                    return (
                        <motion.div
                            key={item.id}
                            layout
                            className={`relative h-full cursor-pointer overflow-hidden rounded-3xl shadow-lg border border-navy-700/5 ${item.color}`}
                            initial={false}
                            animate={{ flex: flexValue }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Image
                                src={images[idx % images.length]}
                                alt={item.title}
                                fill
                                className="object-cover opacity-60 mix-blend-overlay"
                            />

                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.1 }}
                                        className="absolute bottom-8 left-8 right-8 z-10 text-white"
                                    >
                                        <p className="text-sm font-merriweather uppercase tracking-widest opacity-80 mb-2">{item.category}</p>
                                        <h3 className="text-4xl font-serif mb-2">{item.title}</h3>
                                        <p className="text-sm opacity-60">{item.year}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Vertical text when collapsed */}
                            {!isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="writing-vertical-rl text-white/50 font-merriweather text-sm tracking-widest uppercase rotate-180 whitespace-nowrap">
                                        {item.category} • {item.title}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
