"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { createPortal } from "react-dom";
import { requestResume } from "@/app/actions/resume";

export function ResumeRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragMax, setDragMax] = useState(200);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const textOpacity = useTransform(x, [0, Math.max(100, dragMax * 0.6)], [1, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const calculateBounds = () => {
      if (constraintsRef.current) {
        const desktop = window.innerWidth >= 768;
        const knobWidth = desktop ? 64 : 48; // w-16 or w-12
        const padding = 16; // 8px left + 8px right (p-2)
        setDragMax(constraintsRef.current.offsetWidth - knobWidth - padding);
      }
    };
    
    checkMobile();
    calculateBounds();
    
    const handleResize = () => {
      checkMobile();
      calculateBounds();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    // Activate if dragged at least 65% of the calculated max drag
    if (info.offset.x > dragMax * 0.65) {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
      setIsOpen(true);
    }
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-32 flex flex-col items-center justify-center px-4 relative z-10">
      <div className="max-w-2xl text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-serif font-semibold mb-6 tracking-tight text-neutral-900">Let's Connect</h2>
        <p className="text-neutral-500 font-sans text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          I believe meaningful opportunities begin with meaningful conversations. Before downloading my resume, I'd love to know a little about who you are.
        </p>
      </div>

      <div 
        ref={constraintsRef} 
        className="relative w-full max-w-[320px] md:max-w-md h-16 md:h-20 bg-white border border-neutral-200 rounded-full shadow-sm flex items-center p-2 overflow-hidden cursor-pointer hover:border-neutral-300 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-neutral-400 font-medium text-xs md:text-sm tracking-[0.05em] uppercase flex items-center gap-2">
            Slide to Download Resume <span className="ml-1 opacity-70">→</span>
          </span>
        </motion.div>
        
        <motion.div
          className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-neutral-900 rounded-full flex items-center justify-center shadow-md z-10 cursor-grab active:cursor-grabbing pointer-events-auto"
          drag="x"
          style={{ x }}
          dragConstraints={{ left: 0, right: dragMax }}
          dragElastic={0}
          dragSnapToOrigin
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()} // Prevent double trigger
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </motion.div>
      </div>

      <ResumeModal isOpen={isOpen} onClose={() => setIsOpen(false)} isMobile={isMobile} />
    </section>
  );
}

function ResumeModal({ isOpen, onClose, isMobile }: { isOpen: boolean, onClose: () => void, isMobile: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setStatus("idle");
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => { 
      document.body.style.overflow = ""; 
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const validateForm = (formData: FormData) => {
    const name = (formData.get("name") as string || "").trim();
    const email = (formData.get("email") as string || "").trim();
    const phone = (formData.get("phone") as string || "").trim();
    const company = (formData.get("company") as string || "").trim();

    if (!name || !/^[A-Za-z\s]+$/.test(name)) {
      return "Name can only contain letters and spaces.";
    }

    if (!email || !/^.+@(gmail\.com|yahoo\.com|outlook\.com)$/i.test(email)) {
      return "Please provide a valid Gmail, Yahoo, or Outlook email address.";
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return "Phone number must be exactly 10 digits.";
    }

    if (company && !/^[A-Za-z0-9\s\-\.,&]+$/.test(company)) {
      return "Company name contains invalid characters.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    const validationError = validateForm(formData);
    
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setStatus("loading");
    const result = await requestResume(formData);
    
    if (result?.error) {
      setErrorMessage(result.error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  const Header = () => (
    <div className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-100 shrink-0">
      <div>
        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-neutral-900">Before You Download</h3>
        <p className="text-neutral-500 text-sm md:text-base mt-2">I'd love to know a little about who you are.</p>
      </div>
      <button onClick={onClose} className="p-3 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-50 bg-neutral-50/50 shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );

  const Body = () => (
    <div 
      className="flex-1 overflow-y-auto p-6 md:p-8 overscroll-contain min-h-0"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {status === "success" ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-12 md:py-24">
          <div className="w-20 h-20 bg-neutral-900 text-white rounded-full flex items-center justify-center mb-8 shrink-0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 className="text-3xl font-serif font-semibold mb-4 text-neutral-900">Thanks for reaching out.</h3>
          <p className="text-neutral-600 mb-2 text-lg">I've received your details.</p>
          <p className="text-neutral-600 mb-8 text-lg">A copy of my resume is now ready for download.<br/>Looking forward to connecting.</p>
          <p className="text-neutral-400 font-serif italic mb-10">— Dhanesh</p>
          <a href="/resume.pdf" download="Dhanesh_Shetty_Resume.pdf" className="inline-flex items-center justify-center bg-neutral-900 text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform shadow-lg shadow-black/10 shrink-0">
            Download Resume <span className="ml-2">↓</span>
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-400">Name *</label>
              <input required name="name" className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-neutral-900 transition-colors bg-transparent text-neutral-900 placeholder:text-neutral-300" placeholder="Jane Doe" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-400">Email *</label>
              <input required type="email" name="email" className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-neutral-900 transition-colors bg-transparent text-neutral-900 placeholder:text-neutral-300" placeholder="jane@gmail.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-400">Phone Number (10 digits)</label>
              <input name="phone" className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-neutral-900 transition-colors bg-transparent text-neutral-900 placeholder:text-neutral-300" placeholder="Optional" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-400">Company / Organization</label>
              <input name="company" className="w-full border-b border-neutral-200 py-2 focus:outline-none focus:border-neutral-900 transition-colors bg-transparent text-neutral-900 placeholder:text-neutral-300" placeholder="Optional" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-400">What brings you here?</label>
            <div className="flex flex-wrap gap-3">
              {["Recruiter", "Founder", "Potential Client", "Collaborator", "Student"].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="reason" value={option} className="peer sr-only" />
                  <span className="px-5 py-2.5 rounded-full border border-neutral-200 text-sm peer-checked:bg-neutral-900 peer-checked:text-white peer-checked:border-neutral-900 transition-all hover:border-neutral-400 text-neutral-600">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-400">Message</label>
            <textarea name="message" rows={4} className="w-full border border-neutral-200 rounded-2xl p-5 focus:outline-none focus:border-neutral-900 transition-colors bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 resize-none" placeholder="Any specific context you'd like to share?"></textarea>
          </div>

          {errorMessage && <p className="text-red-500 text-sm font-medium">{errorMessage}</p>}

          <div className="pt-8">
            <button disabled={status === "loading"} type="submit" className="w-full bg-neutral-900 text-white py-4 md:py-5 rounded-full font-medium hover:bg-black transition-transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-black/5 text-base shrink-0">
              {status === "loading" ? "Sending..." : "Send & Download Resume"}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          {isMobile ? (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white rounded-t-[2rem] z-[101] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
              <Header />
              <Body />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[90vh] bg-white rounded-[2rem] z-[101] overflow-hidden shadow-2xl flex flex-col"
            >
              <Header />
              <Body />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
