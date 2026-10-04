"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { logout, restore, saveContent, versions } from "@/app/studio/actions";
import { SHAPES, type Content, type Project } from "@/lib/content/types";
import type { Version } from "@/lib/content/store";

type Tab = "projects" | "profile" | "log" | "recognition" | "skills" | "archive" | "faq" | "resume" | "history";
const TABS: [Tab, string][] = [
  ["projects", "Projects"], ["profile", "Profile"], ["log", "Log"], ["recognition", "Recognition"],
  ["skills", "Skills"], ["archive", "Also built"], ["faq", "FAQ"], ["resume", "Resume"], ["history", "History"],
];

const blankProject = (): Project => ({
  id: `project-${Date.now().toString(36)}`, title: "New project", tag: "", year: String(new Date().getFullYear()),
  summary: "", problem: "", built: "", outcome: "", stack: [], shape: "globe", links: [], isNew: true,
});

function move<T>(list: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export default function Editor({ initial, storage, uploads, local }: { initial: Content; storage: boolean; uploads: boolean; local: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [c, setC] = useState(initial);
  const [tab, setTab] = useState<Tab>("projects");
  const [open, setOpen] = useState<number | null>(0);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = useMemo(() => JSON.stringify(c) !== JSON.stringify(saved), [c, saved]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const save = () => start(async () => {
    const res = await saveContent(c);
    if (res.ok && res.data) { setSaved(res.data); setC(res.data); setToast({ kind: "ok", text: "Published. The live site is updated." }); }
    else if (!res.ok) setToast({ kind: "err", text: res.error });
  });

  const set = <K extends keyof Content>(k: K, v: Content[K]) => setC((p) => ({ ...p, [k]: v }));
  const setProfile = (k: keyof Content["profile"], v: string | string[]) => setC((p) => ({ ...p, profile: { ...p.profile, [k]: v } }));
  const setProject = (i: number, patch: Partial<Project>) => set("projects", c.projects.map((p, k) => (k === i ? { ...p, ...patch } : p)));

  // files go straight from the browser to Blob storage with a short-lived token from /studio/upload
  const uploadTo = async (file: File, folder: "uploads" | "resume") => {
    const name = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "").slice(-80) || "file";
    setToast({ kind: "ok", text: `Uploading ${file.name}…` });
    try {
      const blob = await upload(`${folder}/${name}`, file, { access: "public", handleUploadUrl: "/studio/upload", contentType: file.type });
      setToast({ kind: "ok", text: "Uploaded. Publish to make it live." });
      return blob.url;
    } catch (e) {
      setToast({ kind: "err", text: (e as Error).message });
      return null;
    }
  };

  return (
    <div className="studio">
      <header className="s-top">
        <div>
          <span className="s-mono">Studio</span>
          <h1>Your site</h1>
        </div>
        <div className="s-actions">
          <span className={`s-state ${dirty ? "dirty" : ""}`}>{dirty ? "Unsaved changes" : `Last published ${new Date(saved.updatedAt).toLocaleString()}`}</span>
          <a className="s-btn s-ghost" href="/" target="_blank" rel="noopener">View site</a>
          <button className="s-btn s-ghost" onClick={() => setC(saved)} disabled={!dirty || pending}>Discard</button>
          <button className="s-btn primary" onClick={save} disabled={!dirty || pending || !storage}>{pending ? "Publishing…" : "Publish"}</button>
          <form action={logout}><button className="s-btn s-ghost">Sign out</button></form>
        </div>
      </header>

      {local && (
        <p className="s-warn">Local mode: publishing saves to ./.content on this machine. File uploads need the Vercel Blob store and work once deployed.</p>
      )}
      {!storage && (
        <p className="s-warn">Storage isn&apos;t connected, so changes can&apos;t be published yet. In Vercel: Storage → Create → Blob, connect it to this project, then redeploy.</p>
      )}

      <nav className="s-tabs">
        {TABS.map(([k, label]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>)}
      </nav>

      <main className="s-body">
        {tab === "projects" && (
          <section>
            <p className="s-help">These are the stops in the space flight, in order. Each one gets its own particle shape.</p>
            {c.projects.map((p, i) => (
              <div className={`s-card ${open === i ? "open" : ""}`} key={p.id}>
                <div className="s-card-head">
                  <button className="s-title" onClick={() => setOpen(open === i ? null : i)}>
                    <span className="s-mono">{String(i + 1).padStart(2, "0")}</span> {p.title || "Untitled"} <span className="s-dim">{p.tag}</span>
                  </button>
                  <div className="s-row-btns">
                    <button onClick={() => set("projects", move(c.projects, i, -1))} aria-label="Move up">↑</button>
                    <button onClick={() => set("projects", move(c.projects, i, 1))} aria-label="Move down">↓</button>
                    <button onClick={() => { if (confirm(`Remove ${p.title}?`)) set("projects", c.projects.filter((_, k) => k !== i)); }} aria-label="Remove">✕</button>
                  </div>
                </div>
                {open === i && (
                  <div className="s-grid">
                    <Text label="Title" value={p.title} onChange={(v) => setProject(i, { title: v })} />
                    <Text label="Tag" value={p.tag} onChange={(v) => setProject(i, { tag: v })} hint="Mobile app, Robotics…" />
                    <Text label="Year" value={p.year} onChange={(v) => setProject(i, { year: v })} />
                    <label className="s-field">Particle shape
                      <select value={p.shape} onChange={(e) => setProject(i, { shape: e.target.value as Project["shape"] })}>
                        {SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                    <label className="s-check"><input type="checkbox" checked={!!p.isNew} onChange={(e) => setProject(i, { isNew: e.target.checked })} /> Show NEW badge</label>
                    <Area wide label="Summary" value={p.summary} onChange={(v) => setProject(i, { summary: v })} />
                    <Area label="Problem" value={p.problem} onChange={(v) => setProject(i, { problem: v })} />
                    <Area label="What I built" value={p.built} onChange={(v) => setProject(i, { built: v })} />
                    <Area label="Outcome" value={p.outcome} onChange={(v) => setProject(i, { outcome: v })} />
                    <Text wide label="Stack (comma separated)" value={p.stack.join(", ")} onChange={(v) => setProject(i, { stack: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                    <Area wide label="Links (one per line: Label | https://…)" value={p.links.map((l) => `${l.label} | ${l.href}`).join("\n")}
                      onChange={(v) => setProject(i, { links: v.split("\n").map((line) => { const [label, ...rest] = line.split("|"); return { label: label.trim(), href: rest.join("|").trim() }; }).filter((l) => l.label || l.href) })} />
                    <div className="s-field wide">Media for the case study
                      <div className="s-media">
                        {p.media?.src && (p.media.type === "video"
                          ? <video src={p.media.src} muted loop autoPlay playsInline />
                          // eslint-disable-next-line @next/next/no-img-element
                          : <img src={p.media.src} alt="" />)}
                        <div>
                          <input type="file" accept="image/*,video/mp4,video/webm" disabled={!uploads} onChange={async (e) => {
                            const f = e.target.files?.[0]; if (!f) return;
                            const url = await uploadTo(f, "uploads");
                            if (url) setProject(i, { media: { type: f.type.startsWith("video") ? "video" : "image", src: url } });
                          }} />
                          <input placeholder="…or paste a URL" value={p.media?.src ?? ""} onChange={(e) => setProject(i, { media: e.target.value ? { type: /\.(mp4|webm)(\?|$)/i.test(e.target.value) ? "video" : "image", src: e.target.value } : undefined })} />
                          {p.media && <button className="s-link" onClick={() => setProject(i, { media: undefined })}>Remove media</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button className="s-btn s-ghost" onClick={() => { set("projects", [...c.projects, blankProject()]); setOpen(c.projects.length); }}>+ Add project</button>
          </section>
        )}

        {tab === "profile" && (
          <section className="s-grid">
            <Text label="Name" value={c.profile.name} onChange={(v) => setProfile("name", v)} />
            <Text label="Location" value={c.profile.location} onChange={(v) => setProfile("location", v)} />
            <Area wide label="Intro" value={c.profile.intro} onChange={(v) => setProfile("intro", v)} />
            <Text label="Rolling words (comma separated)" value={c.profile.verbs.join(", ")} onChange={(v) => setProfile("verbs", v.split(",").map((s) => s.trim()).filter(Boolean))} />
            <Text label="Focus line (comma separated)" value={c.profile.focus.join(", ")} onChange={(v) => setProfile("focus", v.split(",").map((s) => s.trim()).filter(Boolean))} />
            <Text label="Currently building" value={c.profile.building} onChange={(v) => setProfile("building", v)} hint="Leave empty to show your latest GitHub push" />
            <Text label="Open to" value={c.profile.openTo} onChange={(v) => setProfile("openTo", v)} />
            <Text label="Email" value={c.profile.email} onChange={(v) => setProfile("email", v)} />
            <Text label="GitHub username" value={c.profile.githubUser} onChange={(v) => setProfile("githubUser", v)} />
            <Text label="GitHub URL" value={c.profile.github} onChange={(v) => setProfile("github", v)} />
            <Text label="LinkedIn URL" value={c.profile.linkedin} onChange={(v) => setProfile("linkedin", v)} />
          </section>
        )}

        {tab === "log" && (
          <Rows items={c.log} onChange={(v) => set("log", v)} blank={{ date: "", title: "", note: "" }}
            fields={[["date", "Date", 1], ["title", "Title", 2], ["note", "Note", 3]]} help="Newest first. Shown as the timeline." />
        )}
        {tab === "recognition" && (
          <>
            <Rows items={c.wins} onChange={(v) => set("wins", v)} blank={{ label: "", title: "" }} fields={[["label", "Label", 1], ["title", "Title", 3]]} help="Awards and roles, shown as cards." />
            <Rows items={c.certs.map((t) => ({ t }))} onChange={(v) => set("certs", v.map((x) => x.t))} blank={{ t: "" }} fields={[["t", "Certificate", 4]]} help="Certificates, shown as chips." />
          </>
        )}
        {tab === "skills" && (
          <Rows items={c.skills.map((g) => ({ group: g.group, items: g.items.join(", ") }))}
            onChange={(v) => set("skills", v.map((g) => ({ group: g.group, items: g.items.split(",").map((s) => s.trim()).filter(Boolean) })))}
            blank={{ group: "", items: "" }} fields={[["group", "Group", 1], ["items", "Skills (comma separated)", 3]]} />
        )}
        {tab === "archive" && (
          <Rows items={c.archive.map((a) => ({ ...a, href: a.href ?? "" }))} onChange={(v) => set("archive", v.map((a) => ({ ...a, href: a.href || undefined })))}
            blank={{ title: "", note: "", href: "" }} fields={[["title", "Title", 1], ["note", "Note", 2], ["href", "Link (optional)", 1]]} help="Smaller projects listed under the flight." />
        )}

        {tab === "faq" && (
          <Rows items={c.faq} onChange={(v) => set("faq", v)} blank={{ q: "", a: "" }} fields={[["q", "Question", 2], ["a", "Answer", 4]]}
            help="Shown on the site and sent to Google and AI assistants as FAQ data. Answer in full sentences that mention your name." />
        )}
        {tab === "resume" && (
          <section className="s-resume">
            <p className="s-help">Upload a new PDF, then Publish. The download button on the site switches to it right away.</p>
            <p>Current: <a href={c.resumeUrl} target="_blank" rel="noopener">{c.resumeUrl}</a></p>
            <input type="file" accept="application/pdf" disabled={!uploads} onChange={async (e) => {
              const f = e.target.files?.[0]; if (!f) return;
              const url = await uploadTo(f, "resume");
              if (url) set("resumeUrl", url);
            }} />
          </section>
        )}

        {tab === "history" && <History onRestore={(content) => { setSaved(content); setC(content); setToast({ kind: "ok", text: "Restored and published." }); }} />}
      </main>

      {toast && <div className={`s-toast ${toast.kind}`} role="status">{toast.text}</div>}
    </div>
  );
}

function Text({ label, value, onChange, hint, wide }: { label: string; value: string; onChange: (v: string) => void; hint?: string; wide?: boolean }) {
  return (
    <label className={`s-field ${wide ? "wide" : ""}`}>{label}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={hint} />
    </label>
  );
}

function Area({ label, value, onChange, wide }: { label: string; value: string; onChange: (v: string) => void; wide?: boolean }) {
  return (
    <label className={`s-field ${wide ? "wide" : ""}`}>{label}
      <textarea value={value} rows={3} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Rows<T extends Record<string, string>>({ items, onChange, blank, fields, help }: {
  items: T[]; onChange: (v: T[]) => void; blank: T; fields: [keyof T & string, string, number][]; help?: string;
}) {
  return (
    <section className="s-rows">
      {help && <p className="s-help">{help}</p>}
      {items.map((it, i) => (
        <div className="s-rowline" key={i} style={{ gridTemplateColumns: `${fields.map((f) => `${f[2]}fr`).join(" ")} auto` }}>
          {fields.map(([k, label]) => (
            <input key={k} aria-label={label} placeholder={label} value={it[k]} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} />
          ))}
          <div className="s-row-btns">
            <button onClick={() => onChange(move(items, i, -1))} aria-label="Move up">↑</button>
            <button onClick={() => onChange(move(items, i, 1))} aria-label="Move down">↓</button>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
          </div>
        </div>
      ))}
      <button className="s-btn s-ghost" onClick={() => onChange([...items, { ...blank }])}>+ Add</button>
    </section>
  );
}

function History({ onRestore }: { onRestore: (c: Content) => void }) {
  const [list, setList] = useState<Version[] | null>(null);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  useEffect(() => { versions().then((r) => (r.ok ? setList(r.data ?? []) : setErr(r.error))); }, []);
  if (err) return <p className="s-error">{err}</p>;
  if (!list) return <p className="s-help">Loading…</p>;
  if (!list.length) return <p className="s-help">No published versions yet. The site is showing the bundled content.</p>;
  return (
    <section className="s-rows">
      <p className="s-help">The last {list.length} published versions. Restoring one publishes it again as the newest.</p>
      {list.map((v, i) => (
        <div className="s-rowline" key={v.url} style={{ gridTemplateColumns: "1fr auto" }}>
          <span>{new Date(v.uploadedAt).toLocaleString()} {i === 0 && <b className="s-badge">live</b>}</span>
          {i > 0 && <button className="s-btn s-ghost" disabled={pending} onClick={() => start(async () => {
            if (!confirm("Restore this version and publish it?")) return;
            const r = await restore(v.url);
            if (r.ok && r.data) onRestore(r.data); else if (!r.ok) setErr(r.error);
          })}>Restore</button>}
        </div>
      ))}
    </section>
  );
}
