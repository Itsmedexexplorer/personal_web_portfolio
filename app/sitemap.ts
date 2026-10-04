import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/store";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { updatedAt, projects } = await getContent();
  const lastModified = new Date(updatedAt);
  return [
    { url: SITE, lastModified, changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({ url: `${SITE}/work/${p.id}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE}/llms.txt`, lastModified, changeFrequency: "weekly", priority: 0.3 },
  ];
}
