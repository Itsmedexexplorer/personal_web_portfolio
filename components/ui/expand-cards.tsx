"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Certificate } from "@/lib/data";

const ArrowUpRight = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
    >
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

function Modal({ 
    isOpen, 
    onClose, 
    item 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    item: Certificate | null 
}) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !item) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/65 backdrop-blur-[20px]"
                onClick={onClose}
            >
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1 }}
                    className="fixed top-8 right-8 text-white text-4xl font-light z-[110]"
                    onClick={onClose}
                >
                    ✕
                </motion.button>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[1.414/1] bg-white rounded-lg shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain bg-neutral-900"
                        priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <p className="text-sm font-merriweather tracking-widest uppercase opacity-70 mb-1">
                            {item.category} • {item.title}
                        </p>
                        <p className="text-lg font-serif">{item.modalInfo}</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

export function ExpandOnHover({ items }: { items: Certificate[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Certificate | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return (
            <>
                <div className="flex flex-col gap-4 w-full px-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`relative w-full h-[300px] rounded-3xl overflow-hidden shadow-lg border border-white/10 cursor-pointer ${item.color}`}
                            onClick={() => setSelectedItem(item)}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover opacity-70"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                <p className="text-[10px] font-sans uppercase tracking-[0.2em] opacity-70 mb-1">
                                    {item.category} • {item.title}
                                </p>
                                <h3 className="text-2xl font-serif mb-1">{item.title}</h3>
                                <p className="text-xs opacity-50">{item.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Modal 
                    isOpen={!!selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    item={selectedItem} 
                />
            </>
        );
    }

    return (
        <div className="w-full flex items-center justify-center py-10 px-4">
            <div className="flex w-full max-w-7xl items-center justify-center gap-3 h-[500px]">
                {items.map((item, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const flexValue = isHovered ? 4 : 1;

                    return (
                        <motion.div
                            key={item.id}
                            layout
                            className={`relative h-full cursor-pointer overflow-hidden rounded-3xl shadow-lg border border-white/10 ${item.color}`}
                            initial={false}
                            animate={{ flex: flexValue }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => setSelectedItem(item)}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover opacity-70 transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30" />

                            <AnimatePresence>
                                {isHovered && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute bottom-8 left-8 right-8 z-10 text-white"
                                        >
                                            <p className="text-xs font-sans uppercase tracking-[0.3em] opacity-70 mb-2">
                                                {item.category} • {item.title}
                                            </p>
                                            <h3 className="text-4xl font-serif mb-2">{item.title}</h3>
                                            <p className="text-sm opacity-50">{item.year}</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute inset-0 flex items-center justify-center z-20"
                                        >
                                            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white">
                                                <ArrowUpRight />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            {!isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="writing-vertical-rl text-white/40 font-sans text-[10px] tracking-[0.4em] uppercase rotate-180 whitespace-nowrap">
                                        {item.category} • {item.title}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            <Modal 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
                item={selectedItem} 
            />
        </div>
    );
}
