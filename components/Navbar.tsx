"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/lib/data';

export function Navbar() {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-black/5 shadow-sm rounded-full px-6 py-3 flex items-center justify-center max-w-fit"
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
    );
}
