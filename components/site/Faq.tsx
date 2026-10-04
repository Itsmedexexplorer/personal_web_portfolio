import type { Faq as FaqItem } from "@/lib/content/types";

// Plain questions and answers: readable by people, search engines and AI assistants alike.
export default function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" data-sec="06 · FAQ" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="mono">06 — Questions</div>
        <h2 className="roll" id="faq-title"><span className="ln"><span>Quick</span></span><span className="ln"><span className="serif">answers.</span></span></h2>
        <div className="faq">
          {items.map((f, i) => (
            <details key={i} className="fade" open={i === 0}>
              <summary><h3>{f.q}</h3><span className="plus" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
