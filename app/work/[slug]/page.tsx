import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content/store";
import { ld, projectJsonLd } from "@/lib/seo";
import { Arrow } from "@/components/site/icons";
import "../work.css";

// One indexable page per project, so each can rank on its own name.
export const revalidate = 3600;

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects, profile } = await getContent();
  const p = projects.find((x) => x.id === slug);
  if (!p) return {};
  const title = `${p.title} — ${p.tag} by ${profile.name}`;
  return {
    title: { absolute: title },
    description: p.summary,
    keywords: [p.title, `${p.title} ${profile.name}`, ...p.stack, profile.name, p.tag],
    alternates: { canonical: `/work/${p.id}` },
    openGraph: { type: "article", url: `/work/${p.id}`, title, description: p.summary, images: p.media?.poster ? [p.media.poster] : undefined },
    twitter: { card: "summary_large_image", title, description: p.summary },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const i = content.projects.findIndex((x) => x.id === slug);
  if (i < 0) notFound();
  const p = content.projects[i];
  const next = content.projects[(i + 1) % content.projects.length];

  return (
    <div className="work-page">
      <header className="wp-top">
        <Link href="/" className="wp-home">{content.profile.name}</Link>
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#work">Work</Link></li>
            <li aria-current="page">{p.title}</li>
          </ol>
        </nav>
      </header>

      <main className="wp-main">
        <p className="mono">{p.tag} · {p.year}</p>
        <h1>{p.title}</h1>
        <p className="wp-lead">{p.summary}</p>

        {p.media?.type === "video" && (
          <video className="wp-media" src={p.media.src} poster={p.media.poster} autoPlay muted loop playsInline preload="metadata" width={1280} height={720} />
        )}
        {p.media?.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="wp-media" src={p.media.src} alt={`${p.title} screenshot`} width={1280} height={720} />
        )}

        <div className="wp-grid">
          <section><h2>The problem</h2><p>{p.problem}</p></section>
          <section><h2>What I built</h2><p>{p.built}</p></section>
          <section><h2>Outcome</h2><p>{p.outcome}</p></section>
        </div>

        <section className="wp-stack">
          <h2>Built with</h2>
          <ul>{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>

        {p.links.length > 0 && (
          <div className="wp-links">
            {p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="wp-btn">{l.label} <Arrow /></a>)}
          </div>
        )}

        <Link href={`/work/${next.id}`} className="wp-next">
          <span className="mono">Next project</span>
          <strong>{next.title}</strong>
          <Arrow />
        </Link>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={ld(projectJsonLd(content, p))} />
    </div>
  );
}
