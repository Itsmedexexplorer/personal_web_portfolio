"use client";

import { useState } from "react";
import type { Profile } from "@/lib/content/types";
import { Arrow } from "./icons";

export default function Contact({ profile, resumeUrl }: { profile: Profile; resumeUrl: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { location.href = `mailto:${profile.email}`; return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <section className="contact" id="contact" data-sec="07 · Contact">
      <div className="wrap">
        <div className="mono">07 — Contact</div>
        <h2 className="roll"><span className="ln"><span>Let&apos;s build</span></span><span className="ln"><span className="serif">something next.</span></span></h2>
        <p className="open-to fade">{profile.openTo}</p>
        <div className="fade mail-row">
          <button className="mail" onClick={copy} aria-label={`Copy email address ${profile.email}`}>{profile.email}</button>
          <span className={`copied ${copied ? "on" : ""}`} role="status">{copied ? "Copied" : ""}</span>
        </div>
        <div className="btns fade">
          <a className="btn solid" href={resumeUrl} target="_blank" rel="noopener" download>Download resume <Arrow /></a>
          <a className="btn glass" href={`mailto:${profile.email}`}>Email</a>
          <a className="btn glass" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn glass" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <footer className="mono">
          <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
          <span>Built with Next.js and Three.js</span>
        </footer>
      </div>
    </section>
  );
}
