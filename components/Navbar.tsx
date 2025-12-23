"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Project' },
    { id: 'certifications', label: 'Credentials' },
    { id: 'contact', label: 'Hire Me!', isCta: true },
];

export function Navbar() {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-50% 0px -50% 0px',
            }
        );

        navItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // lenis usually handles native smooth scroll behavior if configured
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-navy-900/5 rounded-full px-6 py-2 flex items-center justify-center max-w-fit"
        >
            <ul className="flex items-center gap-2 md:gap-4 list-none text-navy-700 font-merriweather text-sm md:text-sm font-medium tracking-wide">
                {navItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                        <React.Fragment key={item.id}>
                            <li className="relative">
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => scrollToSection(e, item.id)}
                                    className={`relative z-10 px-4 py-2 block transition-colors duration-300 ${isActive ? 'text-navy-900' : 'text-navy-700/60 hover:text-navy-900'} ${item.isCta ? 'flex items-center gap-1 font-bold' : ''}`}
                                >
                                    {item.label}
                                    {item.isCta && <span className="text-sm">→</span>}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-navy-100"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </a>
                            </li>
                            {index < navItems.length - 1 && !item.isCta && !navItems[index + 1].isCta && (
                                <li className="text-navy-700/10 font-light">•</li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ul>
        </motion.nav>
    );
}
