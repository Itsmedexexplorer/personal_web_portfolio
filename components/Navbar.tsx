"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/lib/data';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Desktop Navbar */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-black/5 shadow-sm rounded-full px-6 py-3 hidden md:flex items-center justify-center max-w-fit"
            >
                <ul className="flex items-center gap-6 list-none text-sm font-medium text-neutral-600">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => scrollToSection(e, item.id)}
                                className={`transition-colors hover:text-black ${item.isCta ? 'px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-800' : ''}`}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </motion.nav>

            {/* Mobile Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 md:hidden flex flex-col items-center w-[95%] max-w-[400px]">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-md border border-black/5 shadow-sm rounded-full px-5 py-2 w-full flex items-center justify-between"
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 text-neutral-600 hover:text-black focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    {NAV_ITEMS.filter(item => item.isCta).map(item => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => {
                                scrollToSection(e, item.id);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </a>
                    ))}
                </motion.nav>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 w-full bg-white/90 backdrop-blur-lg border border-black/5 shadow-xl rounded-2xl p-4 flex flex-col gap-2 text-sm font-medium text-neutral-600"
                        >
                            {NAV_ITEMS.filter(item => !item.isCta).map(item => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        scrollToSection(e, item.id);
                                        setIsOpen(false);
                                    }}
                                    className="hover:text-black hover:bg-black/5 rounded-lg px-4 py-3 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
