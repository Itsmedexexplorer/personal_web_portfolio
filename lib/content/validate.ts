import { DEFAULT_CONTENT } from "./defaults";
import { SHAPES, type Content, type Project, type Shape } from "./types";

// Coerces anything (an old saved version, a hand-edited file, studio input) into a valid
// Content document. Unknown fields are dropped, missing ones come from the defaults,
// and only http(s), mailto and site-relative links survive.

const str = (v: unknown, max = 2000, fallback = ""): string => (typeof v === "string" ? v.slice(0, max).trim() : fallback);
const arr = <T>(v: unknown, f: (x: unknown) => T | null, max = 60): T[] =>
  Array.isArray(v) ? v.slice(0, max).map(f).filter((x): x is T => x !== null) : [];
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export function safeUrl(v: unknown): string {
  const s = str(v, 2000);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const u = new URL(s);
    return ["https:", "http:", "mailto:"].includes(u.protocol) ? u.toString() : "";
  } catch {
    return "";
  }
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function project(v: unknown): Project | null {
  const o = obj(v);
  const title = str(o.title, 80);
  if (!title) return null;
  const shape = (SHAPES as readonly string[]).includes(o.shape as string) ? (o.shape as Shape) : "globe";
  const m = obj(o.media);
  const mediaSrc = safeUrl(m.src);
  return {
    id: slug(str(o.id, 60) || title) || `p-${Math.random().toString(36).slice(2, 8)}`,
    title,
    tag: str(o.tag, 60),
    year: str(o.year, 20),
    summary: str(o.summary, 400),
    problem: str(o.problem, 400),
    built: str(o.built, 500),
    outcome: str(o.outcome, 400),
    stack: arr(o.stack, (x) => str(x, 40) || null, 12),
    shape,
    links: arr(o.links, (x) => {
      const l = obj(x), href = safeUrl(l.href), label = str(l.label, 40);
      return href && label ? { label, href } : null;
    }, 6),
    media: mediaSrc ? { type: m.type === "image" ? "image" : "video", src: mediaSrc, poster: safeUrl(m.poster) || undefined } : undefined,
    isNew: Boolean(o.isNew),
  };
}

export function normalizeContent(input: unknown): Content {
  const o = obj(input), d = DEFAULT_CONTENT, p = obj(o.profile);
  const list = (v: unknown, max = 12) => arr(v, (x) => str(x, 60) || null, max);
  return {
    profile: {
      name: str(p.name, 80) || d.profile.name,
      intro: str(p.intro, 400) || d.profile.intro,
      verbs: list(p.verbs, 8).length ? list(p.verbs, 8) : d.profile.verbs,
      focus: list(p.focus, 8).length ? list(p.focus, 8) : d.profile.focus,
      location: str(p.location, 80),
      email: str(p.email, 120) || d.profile.email,
      openTo: str(p.openTo, 300),
      building: str(p.building, 120),
      github: safeUrl(p.github) || d.profile.github,
      githubUser: str(p.githubUser, 60).replace(/[^A-Za-z0-9-]/g, "") || d.profile.githubUser,
      linkedin: safeUrl(p.linkedin) || d.profile.linkedin,
    },
    projects: o.projects === undefined ? d.projects : arr(o.projects, project, 24),
    archive: o.archive === undefined ? d.archive : arr(o.archive, (x) => {
      const a = obj(x), title = str(a.title, 80);
      return title ? { title, note: str(a.note, 200), href: safeUrl(a.href) || undefined } : null;
    }, 24),
    log: o.log === undefined ? d.log : arr(o.log, (x) => {
      const l = obj(x), title = str(l.title, 100);
      return title ? { date: str(l.date, 30), title, note: str(l.note, 240) } : null;
    }, 40),
    wins: o.wins === undefined ? d.wins : arr(o.wins, (x) => {
      const w = obj(x), title = str(w.title, 100);
      return title ? { label: str(w.label, 60), title } : null;
    }, 16),
    certs: o.certs === undefined ? d.certs : arr(o.certs, (x) => str(x, 140) || null, 24),
    skills: o.skills === undefined ? d.skills : arr(o.skills, (x) => {
      const g = obj(x), group = str(g.group, 40);
      return group ? { group, items: arr(g.items, (i) => str(i, 40) || null, 24) } : null;
    }, 12),
    faq: o.faq === undefined ? d.faq : arr(o.faq, (x) => {
      const f = obj(x), q = str(f.q, 200), a = str(f.a, 800);
      return q && a ? { q, a } : null;
    }, 20),
    resumeUrl: safeUrl(o.resumeUrl) || d.resumeUrl,
    updatedAt: str(o.updatedAt, 40) || d.updatedAt,
  };
}
