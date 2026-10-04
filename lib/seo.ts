import type { Content, Project } from "./content/types";

export const SITE = "https://www.dhaneshshetty.in";

export const KEYWORDS = [
  "Dhanesh Shetty", "Dhanesh Shetty portfolio", "Dhanesh Shetty developer", "Dhanesh Shetty AI", "Dhanesh Shetty Nexa Tech",
  "Dhanesh Shetty NIAT", "Dhanesh Shetty Kolhapur", "AI agent developer India", "AI automation engineer", "agentic AI developer",
  "React Native developer India", "Expo app developer", "ROS 2 drone developer", "n8n automation expert", "WhatsApp automation developer",
  "Next.js developer portfolio", "Three.js portfolio", "AI & Data Science student", "Sanjay Ghodawat University", "Nexa Tech co-founder",
  "CamArt app", "NIDAR AirMouse", "ShilpSetu AI", "TO'KA desktop AI companion", "Tera voice agents",
];

export const projectUrl = (p: Project) => `${SITE}/work/${p.id}`;

const person = (c: Content) => ({
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: c.profile.name,
  givenName: c.profile.name.split(" ")[0],
  familyName: c.profile.name.split(" ").slice(1).join(" "),
  url: SITE,
  image: `${SITE}/opengraph-image`,
  email: `mailto:${c.profile.email}`,
  jobTitle: "AI & Automation Engineer",
  description: c.profile.intro,
  address: { "@type": "PostalAddress", addressLocality: "Kolhapur", addressRegion: "Maharashtra", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Sanjay Ghodawat University (NIAT)" },
  worksFor: { "@type": "Organization", name: "Nexa Tech", url: "https://www.nexa-tech.in/" },
  knowsAbout: c.skills.flatMap((g) => g.items),
  award: c.wins.map((w) => `${w.label}, ${w.title}`),
  sameAs: [c.profile.github, c.profile.linkedin],
});

/** Home page graph: website, profile page, person, featured work and FAQ. */
export function homeJsonLd(c: Content) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: c.profile.name, inLanguage: "en", publisher: { "@id": `${SITE}/#person` } },
      {
        "@type": "ProfilePage", "@id": `${SITE}/#profile`, url: SITE, name: `${c.profile.name} — portfolio`,
        dateModified: c.updatedAt, isPartOf: { "@id": `${SITE}/#website` }, mainEntity: { "@id": `${SITE}/#person` },
      },
      person(c),
      {
        "@type": "ItemList", name: "Selected work",
        itemListElement: c.projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: projectUrl(p), name: p.title })),
      },
      c.faq.length && {
        "@type": "FAQPage", "@id": `${SITE}/#faq`,
        mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }] },
    ].filter(Boolean),
  };
}

export function projectJsonLd(c: Content, p: Project) {
  const isApp = /app|mobile|desktop|cli|terminal/i.test(p.tag);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": isApp ? "SoftwareApplication" : "CreativeWork",
        "@id": `${projectUrl(p)}#work`,
        name: p.title,
        url: projectUrl(p),
        description: p.summary,
        abstract: `${p.problem} ${p.built} ${p.outcome}`,
        keywords: p.stack.join(", "),
        dateCreated: p.year,
        creator: person(c),
        ...(isApp ? { applicationCategory: p.tag, operatingSystem: /mobile/i.test(p.tag) ? "Android" : "Cross-platform" } : {}),
        ...(p.links[0] ? { sameAs: p.links.map((l) => l.href) } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/#work` },
          { "@type": "ListItem", position: 3, name: p.title, item: projectUrl(p) },
        ],
      },
    ],
  };
}

export const ld = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
