"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content/types";
import { lockScroll, onScrollFrame, scrollToY } from "@/lib/scroll-bus";
import { scene } from "@/lib/scene-state";
import { Arrow } from "./icons";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const pad = (n: number) => String(n).padStart(2, "0");
/** the pinned flight uses this share of the section; the rest is a short run-out */
const SPAN = 0.92;

// A pinned flight through every project: the next one waits deep in space, the current one
// sits in front, passed ones fly past the camera. The particle form reshapes for each.
export default function Voyage({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<(HTMLElement | null)[]>([]);
  const ghostRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const w1 = useRef<HTMLSpanElement>(null), w2 = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const N = projects.length;

  useEffect(() => {
    scene.shapes = projects.map((p) => p.shape);
  }, [projects]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !N) return;
    let lastActive = -1;
    return onScrollFrame(() => {
      const r = section.getBoundingClientRect();
      const len = section.offsetHeight - innerHeight;
      const raw = clamp(-r.top / Math.max(1, len) / SPAN) * (N - 1);
      // hold on each project for a moment before flying to the next
      const f = raw - Math.floor(raw);
      const P = Math.min(N - 1, Math.floor(raw) + smooth(0.25, 0.75, f));
      scene.progress = P;
      if (r.top <= innerHeight * 0.15) scene.mode = r.bottom > innerHeight * 0.6 ? "work" : "after";

      const mobile = innerWidth < 900;
      panelsRef.current.forEach((el, i) => {
        if (!el) return;
        const d = i - P, ad = Math.abs(d);
        if (ad > 2.4) { if (el.style.visibility !== "hidden") el.style.visibility = "hidden"; return; }
        el.style.visibility = "visible";
        const z = d > 0 ? -d * 1300 : -d * 700;
        const x = mobile ? 0 : d * 140, y = d * (mobile ? -60 : -30), ry = mobile ? 0 : d * -12;
        el.style.transform = `translate3d(${x.toFixed(1)}px, calc(${mobile ? "0%" : "-50%"} + ${y.toFixed(1)}px), ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`;
        // phones skip blur, so far panels fade faster to keep the one in front clean
        el.style.opacity = String(d > 0 ? clamp(1 - d * (mobile ? 0.9 : 0.42)) : clamp(1 + d * 1.8));
        // blur is expensive on phones; fade alone reads fine there
        el.style.filter = !mobile && ad > 0.04 ? `blur(${Math.min(10, ad * 7).toFixed(1)}px)` : "none";
        const isActive = ad < 0.45;
        el.classList.toggle("active", isActive);
        el.inert = ad > 0.3;
      });

      const ai = clamp(Math.round(P), 0, N - 1);
      if (ai !== lastActive) {
        lastActive = ai;
        setActive(ai);
        const n = pad(ai + 1);
        if (w1.current) w1.current.style.transform = `translateY(-${+n[0] * 10}%)`;
        if (w2.current) w2.current.style.transform = `translateY(-${+n[1] * 10}%)`;
        const g = ghostRef.current;
        if (g) { g.classList.remove("swap"); void g.offsetWidth; g.classList.add("swap"); }
      }
      if (ghostRef.current) ghostRef.current.style.transform = `translate3d(${(-(P / Math.max(1, N - 1)) * 30 + 4).toFixed(2)}vw,0,0)`;
      const fill = railRef.current?.querySelector<HTMLElement>("i");
      if (fill) fill.style.transform = `scaleY(${P / Math.max(1, N - 1)})`;
      if (hintRef.current) hintRef.current.style.opacity = P < 0.3 ? "1" : "0";
    });
  }, [N]);

  const goTo = (i: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + scrollY, len = s.offsetHeight - innerHeight;
    scrollToY(top + (i / Math.max(1, N - 1)) * len * SPAN + 2);
  };

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", onKey);
    return () => { lockScroll(false); removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <section id="work" data-sec="02 · Work" ref={sectionRef} className="voyage" style={{ height: `calc(${N} * 90svh + 100svh)` }} aria-label="Selected work">
      <div className="pin">
        <div className="pin-head">
          <div className="mono">02 — Selected work</div>
          <div className="counter" aria-hidden="true">
            <span className="wheels">
              <span className="wheel" ref={w1}>{[..."0123456789"].map((d) => <span key={d}>{d}</span>)}</span>
              <span className="wheel" ref={w2}>{[..."0123456789"].map((d) => <span key={d}>{d}</span>)}</span>
            </span>
            <small>/ {pad(N)}</small>
          </div>
        </div>
        <div className="ghost" ref={ghostRef} aria-hidden="true">{projects[active]?.title}</div>
        <div className="space">
          {projects.map((p, i) => (
            <article key={p.id} className="panel" ref={(el) => { panelsRef.current[i] = el; }} aria-label={p.title}>
              <div className="p-top pf">
                <span className="mono">Sector {pad(i + 1)} · {p.tag}</span>
                {p.isNew && <span className="new">NEW</span>}
              </div>
              <h3><span className="ln"><span>{p.title}</span></span></h3>
              <p className="pd pf">{p.summary}</p>
              <div className="p-rows pf">
                <div><b>Problem</b>{p.problem}</div>
                <div><b>Built</b>{p.built}</div>
                <div><b>Outcome</b>{p.outcome}</div>
              </div>
              <div className="p-meta pf">
                <div className="tags">{p.stack.slice(0, 4).map((s) => <span key={s}>{s}</span>)}</div>
                <div className="p-cta">
                  <a className="more" href={`/work/${p.id}`}>Details</a>
                  <button className="btn light" onClick={() => setOpen(p)}>Case study <Arrow /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <nav className="rail" ref={railRef} aria-label="Jump to project">
          <div className="rail-line"><i /></div>
          <ol>
            {projects.map((p, i) => (
              <li key={p.id}><button className={i === active ? "on" : ""} onClick={() => goTo(i)}>{pad(i + 1)}  {p.title}</button></li>
            ))}
          </ol>
        </nav>
        <div className="hint mono" ref={hintRef}>Keep scrolling to fly through</div>
      </div>

      {open && createPortal(<CaseStudy project={open} onClose={() => setOpen(null)} />, document.body)}
    </section>
  );
}

function CaseStudy({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }, []);
  return (
    <div className={`case ${shown ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={`${p.title} case study`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet glass" data-lenis-prevent>
        <button className="x" onClick={onClose} aria-label="Close" autoFocus>✕</button>
        <span className="mono">{p.tag} · {p.year}</span>
        <h2>{p.title}</h2>
        <p className="lead">{p.summary}</p>
        <div className="cs">
          <div><span className="mono">Problem</span>{p.problem}</div>
          <div><span className="mono">What I built</span>{p.built}</div>
          <div><span className="mono">Outcome</span>{p.outcome}</div>
        </div>
        {p.media?.type === "video" && (
          <video src={p.media.src} poster={p.media.poster} autoPlay muted loop playsInline preload="metadata" />
        )}
        {p.media?.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.media.src} alt={`${p.title} preview`} loading="lazy" />
        )}
        <div className="cs-foot">
          <div className="tags">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
          <div className="btns">
            <a className={`btn ${p.links.length ? "ghost-btn" : "light"}`} href={`/work/${p.id}`}>Project page <Arrow /></a>
            {p.links.map((l, i) => (
              <a key={l.href} className={`btn ${i === 0 ? "light" : "ghost-btn"}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <Arrow /></a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
