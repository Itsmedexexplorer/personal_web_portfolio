import { getContent } from "@/lib/content/store";
import { SITE } from "@/lib/seo";

// A plain-text summary for AI assistants and answer engines (llmstxt.org).
export const revalidate = 3600;

export async function GET() {
  const c = await getContent();
  const { profile: p } = c;
  const body = [
    `# ${p.name}`,
    "",
    `> ${p.intro} Based in ${p.location}. ${p.openTo}`,
    "",
    `- Website: ${SITE}`,
    `- Email: ${p.email}`,
    `- GitHub: ${p.github}`,
    `- LinkedIn: ${p.linkedin}`,
    `- Resume: ${c.resumeUrl.startsWith("/") ? SITE + c.resumeUrl : c.resumeUrl}`,
    "",
    "## Projects",
    "",
    ...c.projects.map((x) => `- [${x.title}](${SITE}/work/${x.id}): ${x.tag}, ${x.year}. ${x.summary} Built with ${x.stack.join(", ")}.`),
    "",
    "## Also built",
    "",
    ...c.archive.map((a) => `- ${a.title}: ${a.note}`),
    "",
    "## Recognition",
    "",
    ...c.wins.map((w) => `- ${w.label}: ${w.title}`),
    ...c.certs.map((x) => `- Certificate: ${x}`),
    "",
    "## Skills",
    "",
    ...c.skills.map((g) => `- ${g.group}: ${g.items.join(", ")}`),
    "",
    "## FAQ",
    "",
    ...c.faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
