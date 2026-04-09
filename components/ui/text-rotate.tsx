"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextRotateProps {
    texts: string[];
    staggerDuration?: number;
    spring?: any;
    className?: string;
}

export function TextRotate({ 
    texts, 
    staggerDuration = 0.03, 
    spring = { type: "spring", stiffness: 100, damping: 20 },
    className = "" 
}: TextRotateProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [texts]);

    return (
        <span className={`inline-flex h-full flex-col overflow-hidden relative ${className}`}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={spring}
                    className="whitespace-nowrap inline-block"
                >
                    {texts[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
