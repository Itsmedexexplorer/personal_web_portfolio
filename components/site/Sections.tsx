import type { ArchiveItem, LogEntry, SkillGroup, Win } from "@/lib/content/types";
import { Arrow } from "./icons";

function Heading({ index, a, b }: { index: string; a: string; b: string }) {
  return (
    <>
      <div className="mono">{index}</div>
      <h2 className="roll"><span className="ln"><span>{a}</span></span><span className="ln"><span className="serif">{b}</span></span></h2>
    </>
  );
}

export function Nav() {
  return (
    <nav className="nav glass" aria-label="Main">
      <a className="me" href="#top">Dhanesh</a>
      <a href="#github">Activity</a>
      <a href="#work">Work</a>
      <a href="#log">Log</a>
      <a className="cta" href="#contact">Contact</a>
    </nav>
  );
}

export function Hud() {
  return (
    <>
      <div className="hud l" aria-hidden="true"><span id="hud-sec">00 · Ground</span><div className="bar"><i id="hud-bar" /></div></div>
      <div className="hud r" aria-hidden="true">Altitude <b id="hud-alt">0.0 km</b><br /><span id="hud-sub">Clear skies</span></div>
    </>
  );
}

export function Ticker({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return (
    <div className="ticker mono" aria-hidden="true">
      <div className="track">{all.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}

export function Archive({ items }: { items: ArchiveItem[] }) {
  if (!items.length) return null;
  return (
    <section className="archive" aria-label="Also built">
      <div className="wrap">
        <div className="mono">Also built</div>
        <ul className="arc">
          {items.map((a) => (
            <li key={a.title} className="fade">
              {a.href ? (
                <a href={a.href} target="_blank" rel="noopener noreferrer"><b>{a.title}</b><span>{a.note}</span><Arrow /></a>
              ) : (
                <div><b>{a.title}</b><span>{a.note}</span></div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Log({ entries }: { entries: LogEntry[] }) {
  return (
    <section id="log" data-sec="03 · Log">
      <div className="wrap">
        <Heading index="03 — Log" a="The last year," b="in order." />
        <div>
          {entries.map((e, i) => (
            <div className="row fade" key={i}><span className="mono">{e.date}</span><h3>{e.title}</h3><p>{e.note}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Wins({ wins, certs }: { wins: Win[]; certs: string[] }) {
  return (
    <section id="wins" data-sec="04 · Recognition">
      <div className="wrap">
        <Heading index="04 — Recognition" a="Roles &" b="recognition." />
        <div className="wins">
          {wins.map((w) => <div className="glass win fade" key={w.title}><span className="mono">{w.label}</span><b>{w.title}</b></div>)}
        </div>
        {certs.length > 0 && <div className="certs fade">{certs.map((c) => <span key={c}>{c}</span>)}</div>}
      </div>
    </section>
  );
}

export function Stack({ groups }: { groups: SkillGroup[] }) {
  return (
    <section id="stack" data-sec="05 · Stack">
      <div className="wrap">
        <Heading index="05 — Stack" a="Tools I" b="reach for." />
        <div className="groups">
          {groups.map((g) => (
            <div className="group fade" key={g.group}>
              <span className="mono">{g.group}</span>
              <div className="stack">{g.items.map((s) => <span className="sk glass" key={s}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
