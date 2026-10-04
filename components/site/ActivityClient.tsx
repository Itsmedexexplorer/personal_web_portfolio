"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = String(to); return; }
    el.textContent = "0";
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1600);
        el.textContent = String(Math.round(to * (1 - (1 - k) ** 4)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <b ref={ref}>{to}</b>;
}

// Scrolls the calendar to today and shows a tooltip for the hovered day.
export function CalTooltip({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const w = wrap.current;
    if (w) w.scrollLeft = w.scrollWidth;
  }, []);
  return (
    <>
      <div
        className="cal-wrap"
        ref={wrap}
        onPointerMove={(e) => {
          const t = tip.current, c = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
          if (!t) return;
          if (!c || e.pointerType === "touch") { t.style.opacity = "0"; return; }
          t.textContent = c.dataset.tip!;
          t.style.transform = `translate(${e.clientX + 14}px, ${e.clientY - 36}px)`;
          t.style.opacity = "1";
        }}
        onPointerLeave={() => tip.current && (tip.current.style.opacity = "0")}
      >
        {children}
      </div>
      <div className="tip" ref={tip} aria-hidden="true" />
    </>
  );
}
