"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";
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
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-hidden"
                onClick={onClose}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y > 100 || info.offset.y < -100) {
                        onClose();
                    }
                }}
            >
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1 }}
                    className="fixed top-6 right-6 md:top-8 md:right-8 text-white text-3xl md:text-4xl font-light z-[110]"
                    onClick={onClose}
                >
                    ✕
                </motion.button>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl aspect-[3/4] sm:aspect-[4/3] md:aspect-[1.414/1] bg-[#111] rounded-2xl md:rounded-lg shadow-2xl overflow-hidden touch-pan-x touch-pan-y"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 overflow-auto overscroll-contain flex items-center justify-center">
                        <div className="relative w-full h-full min-h-max flex items-center justify-center">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white pointer-events-none">
                        <p className="text-xs md:text-sm font-sans tracking-[0.2em] uppercase opacity-70 mb-2">
                            {item.category}
                        </p>
                        <p className="text-base md:text-lg font-serif">{item.modalInfo}</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

function MobileArcExplorer({ items, onSelect }: { items: Certificate[], onSelect: (item: Certificate) => void }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const panRef = useRef(0);

    const triggerVibration = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(15);
        }
    }, []);

    const handleDragEnd = (e: any, info: PanInfo) => {
        if (info.offset.x < -50 && activeIndex < items.length - 1) {
            triggerVibration();
            setActiveIndex(a => a + 1);
        } else if (info.offset.x > 50 && activeIndex > 0) {
            triggerVibration();
            setActiveIndex(a => a - 1);
        }
    };

    const handlePan = (e: any, info: PanInfo) => {
        const delta = info.delta.x;
        panRef.current += delta;
        
        if (panRef.current < -35) {
            if (activeIndex < items.length - 1) {
                setActiveIndex(a => a + 1);
                triggerVibration();
            }
            panRef.current = 0;
        } else if (panRef.current > 35) {
            if (activeIndex > 0) {
                setActiveIndex(a => a - 1);
                triggerVibration();
            }
            panRef.current = 0;
        }
    };

    const handlePanEnd = () => {
        panRef.current = 0;
    };

    const activeItem = items[activeIndex];
    const RADIUS = 140;
    const ANGLE_STEP = 35; 

    return (
        <div className="w-full flex flex-col items-center pt-8 pb-16 px-4 overflow-hidden select-none">
            {/* Active Certificate Card */}
            <motion.div 
                className="relative w-[85vw] max-w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onClick={() => {
                    triggerVibration();
                    onSelect(activeItem);
                }}
                initial={false}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.98 }}
            >
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`absolute inset-0 ${activeItem.color}`}
                    >
                        <Image
                            src={activeItem.image}
                            alt={activeItem.title}
                            fill
                            className="object-cover opacity-80"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white pointer-events-none">
                            <p className="text-[10px] font-sans uppercase tracking-[0.2em] opacity-70 mb-2">
                                {activeItem.category}
                            </p>
                            <h3 className="text-2xl font-serif leading-tight mb-1">{activeItem.title}</h3>
                            <p className="text-xs opacity-60 mb-4">{activeItem.year}</p>
                            
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-max text-xs font-medium border border-white/10">
                                View Certificate <ArrowUpRight />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Arc Navigation Wheel (iPod Rotate) */}
            <motion.div 
                className="relative w-full h-[180px] mt-12 flex justify-center overflow-visible touch-none cursor-grab active:cursor-grabbing"
                onPan={handlePan}
                onPanEnd={handlePanEnd}
            >
                {items.map((item, idx) => {
                    const diff = idx - activeIndex;
                    const angleDeg = diff * ANGLE_STEP;
                    const angleRad = (angleDeg * Math.PI) / 180;
                    
                    const x = RADIUS * Math.sin(angleRad);
                    const y = RADIUS * Math.cos(angleRad) - RADIUS; 
                    
                    const isActive = idx === activeIndex;
                    const isVisible = Math.abs(diff) <= 2;

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute top-0 left-1/2 -ml-8"
                            animate={{ 
                                x, 
                                y: y * -1, 
                                scale: isActive ? 1.1 : 0.85,
                                opacity: isVisible ? (isActive ? 1 : 1 - Math.abs(diff) * 0.3) : 0,
                                zIndex: isActive ? 10 : 5 - Math.abs(diff)
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            onClick={() => {
                                if (!isActive) triggerVibration();
                                setActiveIndex(idx);
                            }}
                            style={{ width: 64, height: 64 }}
                        >
                            <div 
                                className={`w-full h-full rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center transition-all duration-300 shadow-2xl ${
                                    isActive 
                                    ? 'border-4 border-white ring-4 ring-neutral-200/50 ring-offset-2 ring-offset-[#FAFAFA]' 
                                    : 'border-[3px] border-white/50'
                                }`}
                                style={{
                                    transform: 'translateZ(0)',
                                    WebkitMaskImage: '-webkit-radial-gradient(white, black)'
                                }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover opacity-80"
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
            
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-sans mt-2 mb-8">Swipe arc to explore</p>
        </div>
    );
}

function TabletCarousel({ items, onSelect }: { items: Certificate[], onSelect: (item: Certificate) => void }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const centerPosition = container.scrollLeft + container.clientWidth / 2;
        
        // Find closest card to center
        const cards = Array.from(container.children);
        let closestIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, idx) => {
            const rect = (card as HTMLElement).getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const cardCenter = rect.left - containerRect.left + container.scrollLeft + rect.width / 2;
            const distance = Math.abs(centerPosition - cardCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = idx;
            }
        });

        if (closestIndex !== activeIndex) {
            setActiveIndex(closestIndex);
        }
    };

    return (
        <div className="w-full flex flex-col items-center py-12">
            <div 
                ref={containerRef}
                className="w-full flex overflow-x-auto snap-x snap-mandatory px-[20vw] gap-6 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={handleScroll}
            >
                {items.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    const isNeighbor = Math.abs(idx - activeIndex) === 1;

                    return (
                        <motion.div
                            key={item.id}
                            className={`snap-center shrink-0 w-[60vw] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl cursor-pointer ${item.color} relative`}
                            animate={{ 
                                scale: isActive ? 1 : 0.92,
                                opacity: isActive ? 1 : (isNeighbor ? 0.7 : 0.4)
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={() => {
                                if (isActive) onSelect(item);
                                else {
                                    // Scroll to it
                                    const cards = containerRef.current?.children;
                                    if (cards && cards[idx]) {
                                        cards[idx].scrollIntoView({ behavior: "smooth", inline: "center" });
                                    }
                                }
                            }}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                                <p className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] opacity-70 mb-2">
                                    {item.category}
                                </p>
                                <h3 className="text-2xl md:text-3xl font-serif mb-2">{item.title}</h3>
                                <p className="text-xs md:text-sm opacity-60 mb-4">{item.year}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center gap-3 mt-10">
                {items.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-neutral-800 scale-125' : 'bg-neutral-300'}`} 
                    />
                ))}
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-sans mt-6">Swipe to explore</p>
        </div>
    );
}

function DesktopExpandOnHover({ items, onSelect }: { items: Certificate[], onSelect: (item: Certificate) => void }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
                            onClick={() => onSelect(item)}
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
        </div>
    );
}

export function ExpandOnHover({ items }: { items: Certificate[] }) {
    const [selectedItem, setSelectedItem] = useState<Certificate | null>(null);
    const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 768) setBreakpoint("mobile");
            else if (w < 1280) setBreakpoint("tablet");
            else setBreakpoint("desktop");
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <>
            {breakpoint === "mobile" && <MobileArcExplorer items={items} onSelect={setSelectedItem} />}
            {breakpoint === "tablet" && <TabletCarousel items={items} onSelect={setSelectedItem} />}
            {breakpoint === "desktop" && <DesktopExpandOnHover items={items} onSelect={setSelectedItem} />}
            
            <Modal 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
                item={selectedItem} 
            />
        </>
    );
}
