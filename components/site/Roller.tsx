"use client";

import { useEffect, useState } from "react";

// A word that rolls up to the next one every couple of seconds, looping seamlessly.
export default function Roller({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [instant, setInstant] = useState(false);
  const list = [...words, words[0]];

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || words.length < 2) return;
    const id = setInterval(() => { setInstant(false); setI((v) => v + 1); }, 2200);
    return () => clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    if (i < words.length) return;
    // after showing the duplicate first word, jump back to the real one without animating
    const id = setTimeout(() => { setInstant(true); setI(0); }, 950);
    return () => clearTimeout(id);
  }, [i, words.length]);

  return (
    <span className="roller" aria-label={words.join(" ")}>
      {list.map((w, k) => (
        <span key={k} aria-hidden="true" style={{ transform: `translateY(-${i * 100}%)`, transition: instant ? "none" : undefined }}>{w}</span>
      ))}
    </span>
  );
}
