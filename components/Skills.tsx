"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const SKILL_DATA = [
  {
    category: "LANGUAGES",
    skills: [
      { name: "Python", bar: "████████░░", pct: "85%" },
      { name: "C++", bar: "██████░░░░", pct: "60%" },
      { name: "TypeScript", bar: "███████░░░", pct: "70%" },
      { name: "SQL", bar: "█████░░░░░", pct: "50%" },
    ]
  },
  {
    category: "WEB DEVELOPMENT",
    skills: [
      { name: "Next.js", bar: "████████░░", pct: "80%" },
      { name: "React", bar: "████████░░", pct: "80%" },
      { name: "Tailwind CSS", bar: "█████████░", pct: "90%" },
      { name: "Node.js", bar: "█████░░░░░", pct: "50%" },
    ]
  },
  {
    category: "AI & AGENTS",
    skills: [
      { name: "AI Agents", bar: "██████████", pct: "95%" },
      { name: "RAG Systems", bar: "█████████░", pct: "90%" },
      { name: "OpenAI APIs", bar: "█████████░", pct: "90%" },
      { name: "Voice Agents", bar: "███████░░░", pct: "70%" },
      { name: "LangGraph", bar: "████░░░░░░", pct: "40%" },
    ]
  },
  {
    category: "INFRASTRUCTURE",
    skills: [
      { name: "Supabase", bar: "█████████░", pct: "90%" },
      { name: "Linux", bar: "█████████░", pct: "90%" },
      { name: "Docker", bar: "███████░░░", pct: "70%" },
      { name: "Railway", bar: "███████░░░", pct: "70%" },
      { name: "Git", bar: "███████░░░", pct: "70%" },
    ]
  }
];

const CopyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export function Skills() {
    const [copied, setCopied] = useState(false);
    const [input, setInput] = useState("");
    const [terminalState, setTerminalState] = useState<"idle" | "processing" | "done">("idle");
    const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = async (e?: React.MouseEvent | React.TouchEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const textToCopy = "show skills --all";
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } else {
                throw new Error("Clipboard API not available");
            }
        } catch (error) {
            // Fallback for non-HTTPS environments (like local IP mobile testing)
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // Move it off-screen but FIXED to viewport to prevent scroll jump
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            
            // Prevent auto-scroll during focus
            textArea.focus({ preventScroll: true });
            textArea.select();
            
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            
            textArea.remove();
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && terminalState === "idle") {
            if (input.trim() === "show skills --all") {
                startSequence();
            } else if (input.trim() !== "") {
                setLoadingLogs([`zsh: command not found: ${input}`, "Hint: use 'show skills --all'"]);
                setInput("");
            }
        }
    };

    const startSequence = async () => {
        setTerminalState("processing");
        setLoadingLogs([]);
        const logs = [
            "Loading profile...",
            "Analyzing shipped projects...",
            "Scanning repositories...",
            "Generating skill matrix...",
            "✓ Done"
        ];
        
        let currentLogs: string[] = [];
        for (let log of logs) {
            currentLogs = [...currentLogs, log];
            setLoadingLogs(currentLogs);
            await new Promise(r => setTimeout(r, 450));
        }
        await new Promise(r => setTimeout(r, 200));
        setTerminalState("done");
    };

    return (
        <section id="skills" className="w-full max-w-7xl mx-auto py-24 px-6 md:px-12 bg-[#FAFAFA] scroll-mt-20">
            <div className="flex flex-col items-center">
                
                {/* Heading */}
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4"
                >
                    Skills
                </motion.h2>

                {/* Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-sans text-neutral-500 text-lg mb-8"
                >
                    A look under the hood.
                </motion.p>

                {/* Command Pill */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 bg-[#FDFDFD] border border-neutral-200/80 shadow-sm rounded-full px-5 py-2.5 cursor-pointer hover:shadow-md transition-all group"
                    onClick={handleCopy}
                >
                    <span className="font-mono text-neutral-400 select-none">&gt;</span>
                    <span className="font-mono text-neutral-800 font-medium tracking-wide">show skills --all</span>
                    <div className="w-[1px] h-4 bg-neutral-200 mx-2 shrink-0"></div>
                    <button type="button" className="text-neutral-400 group-hover:text-black transition-colors focus:outline-none flex items-center justify-center w-[70px]">
                        {copied ? (
                            <div className="flex items-center gap-1.5 text-black">
                                <CheckIcon />
                                <span className="text-xs font-medium uppercase tracking-wider">Copied</span>
                            </div>
                        ) : (
                            <CopyIcon />
                        )}
                    </button>
                </motion.div>

                {/* Terminal Window */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-3xl mt-12 bg-[#1C1C1E] rounded-[1.25rem] overflow-hidden shadow-2xl border border-white/5 relative h-[500px] block"
                    onClick={() => {
                        if (terminalState === "idle" && inputRef.current) {
                            inputRef.current.focus();
                        }
                    }}
                >
                    {/* Glass Reflection Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                    {/* macOS Header */}
                    <div className="bg-[#2D2D2F] px-5 h-[48px] flex items-center gap-2 relative z-10 border-b border-black/20">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner" />
                    </div>

                    {/* Terminal Body */}
                    <div 
                        className="p-6 md:p-8 h-[452px] font-mono text-sm md:text-base text-neutral-300 relative z-10 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700/50 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full"
                        style={{ WebkitOverflowScrolling: "touch" }}
                        data-lenis-prevent="true"
                    >
                        
                        {/* Error Logs */}
                        {terminalState === "idle" && loadingLogs.length > 0 && (
                            <div className="mb-6 text-neutral-400 flex flex-col gap-1">
                                {loadingLogs.map((log, i) => (
                                    <span key={i}>{log}</span>
                                ))}
                            </div>
                        )}

                        {/* Prompt Line */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-medium whitespace-nowrap">dhanesh@nexa:~$</span>
                            {terminalState === "idle" && (
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="# Enter the command above"
                                    className="bg-transparent border-none outline-none text-neutral-300 w-full placeholder:text-neutral-600 focus:ring-0 p-0"
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            )}
                            {terminalState !== "idle" && (
                                <span className="text-neutral-300 whitespace-nowrap">show skills --all</span>
                            )}
                        </div>

                        {/* Processing Logs */}
                        {terminalState !== "idle" && (
                            <div className="mt-6 flex flex-col gap-3">
                                {loadingLogs.map((log, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={log.includes("✓") ? "text-white font-medium mt-4" : "text-neutral-400"}
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Final Results Matrix */}
                        {terminalState === "done" && (
                            <div className="mt-10 flex flex-col gap-10 pb-4">
                                {SKILL_DATA.map((section, sectionIdx) => (
                                    <div key={section.category} className="flex flex-col gap-3">
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 + sectionIdx * 0.2 }}
                                            className="text-white font-medium tracking-[0.15em] mb-2"
                                        >
                                            {section.category}
                                        </motion.div>
                                        
                                        {section.skills.map((skill, skillIdx) => (
                                            <motion.div 
                                                key={skill.name}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + sectionIdx * 0.2 + skillIdx * 0.05 }}
                                                className="flex items-center text-neutral-400 min-w-max"
                                            >
                                                <span className="w-32 md:w-44 flex-shrink-0">{skill.name}</span>
                                                <span className="tracking-[0.15em] md:tracking-[0.2em]">{skill.bar}</span>
                                                <span className="w-16 text-right ml-4">{skill.pct}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
