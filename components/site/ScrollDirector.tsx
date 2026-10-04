"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { emitScroll, onScrollFrame, setScrollLock, setScrollTo } from "@/lib/scroll-bus";
import { scene } from "@/lib/scene-state";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// Smooth scrolling, the day-to-orbit colour shift, the HUD and section reveals.
export default function ScrollDirector() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, anchors: { offset: 0 } });
      setScrollTo((y) => lenis!.scrollTo(y, { duration: 1.6 }));
      setScrollLock((locked) => (locked ? lenis!.stop() : lenis!.start()));
    }

    // altitude, text colour and HUD
    const work = document.getElementById("work");
    const alt = document.getElementById("hud-alt");
    const sub = document.getElementById("hud-sub");
    const bar = document.getElementById("hud-bar");
    const sec = document.getElementById("hud-sec");
    const sections = [...document.querySelectorAll<HTMLElement>("[data-sec]")];
    let lastN = -1;
    const off = onScrollFrame((y) => {
      const workTop = work ? work.getBoundingClientRect().top + y : innerHeight * 2;
      const a = clamp(y / Math.max(1, workTop));
      scene.altitude = a;
      if (!work || work.getBoundingClientRect().top > innerHeight * 0.15) scene.mode = y < innerHeight * 0.55 ? "hero" : "activity";

      const n = smooth(0.22, 0.42, a);
      if (Math.abs(n - lastN) > 0.004) {
        lastN = n;
        const ink = mix([15, 27, 45], [238, 242, 250], n).join(",");
        root.style.setProperty("--ink", `rgb(${ink})`);
        root.style.setProperty("--mute", `rgba(${ink},.64)`);
        root.style.setProperty("--hair", `rgba(${ink},.16)`);
        root.style.setProperty("--glass", `rgba(255,255,255,${(0.34 - n * 0.28).toFixed(3)})`);
        root.style.setProperty("--edge", `rgba(255,255,255,${(0.65 - n * 0.5).toFixed(3)})`);
        root.classList.toggle("night", n > 0.5);
      }
      const km = a ** 2.2 * 408;
      if (alt) alt.textContent = km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
      if (sub) sub.textContent = a < 0.15 ? "Clear skies" : a < 0.5 ? "Above the clouds" : a < 0.95 ? "Edge of space" : "Low Earth orbit";
      if (bar) bar.style.transform = `scaleX(${clamp(y / (root.scrollHeight - innerHeight))})`;
      if (sec) {
        let cur = "00 · Ground";
        for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.5) cur = s.dataset.sec!;
        if (sec.textContent !== cur) sec.textContent = cur;
      }
    });

    // one rAF drives Lenis and every scroll subscriber
    let raf = 0, lastY = -1;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      lenis?.raf(t);
      const y = scrollY;
      if (y !== lastY) { lastY = y; emitScroll(y); }
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => emitScroll(scrollY);
    addEventListener("resize", onResize);

    // reveal-on-scroll for anything marked .roll / .fade
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".roll, .fade").forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      off();
      io.disconnect();
      lenis?.destroy();
    };
  }, []);

  return null;
}
