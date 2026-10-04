// Everything the site renders comes from one Content document.
// The studio edits it; the site reads it. Keep it plain JSON.

export const SHAPES = [
  "globe", "clover", "drone", "vase", "pet", "wave", "chat", "leaf", "frames", "terminal", "network", "knot",
] as const;
export type Shape = (typeof SHAPES)[number];

export interface Link {
  label: string;
  href: string;
}

export interface Media {
  type: "video" | "image";
  src: string;
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  tag: string;
  year: string;
  summary: string;
  problem: string;
  built: string;
  outcome: string;
  stack: string[];
  shape: Shape;
  links: Link[];
  media?: Media;
  isNew?: boolean;
}

export interface ArchiveItem {
  title: string;
  note: string;
  href?: string;
}

export interface LogEntry {
  date: string;
  title: string;
  note: string;
}

export interface Win {
  label: string;
  title: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface Profile {
  name: string;
  intro: string;
  verbs: string[];
  focus: string[];
  location: string;
  email: string;
  openTo: string;
  /** Overrides the live "currently building" pill. Empty = latest pushed GitHub repo. */
  building: string;
  github: string;
  githubUser: string;
  linkedin: string;
}

export interface Content {
  profile: Profile;
  projects: Project[];
  archive: ArchiveItem[];
  log: LogEntry[];
  wins: Win[];
  certs: string[];
  skills: SkillGroup[];
  faq: Faq[];
  resumeUrl: string;
  updatedAt: string;
}
