import type { Metadata } from "next";
import { getContent } from "@/lib/content/store";
import { getActivity, getLatestRepo } from "@/lib/github";
import SkyCanvas from "@/components/scene/SkyCanvas";
import ScrollDirector from "@/components/site/ScrollDirector";
import Hero from "@/components/site/Hero";
import Activity from "@/components/site/Activity";
import Voyage from "@/components/site/Voyage";
import Contact from "@/components/site/Contact";
import Faq from "@/components/site/Faq";
import { Archive, Hud, Log, Nav, Stack, Ticker, Wins } from "@/components/site/Sections";
import { homeJsonLd, ld } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Static, refreshed hourly for GitHub data and instantly when the studio publishes.
export const revalidate = 3600;

function ago(iso: string) {
  const h = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 36e5));
  return h < 24 ? `${h}h` : `${Math.round(h / 24)}d`;
}

export default async function Home() {
  const content = await getContent();
  const { profile, projects } = content;
  const [activity, latest] = await Promise.all([getActivity(profile.githubUser), getLatestRepo(profile.githubUser)]);
  const building = profile.building
    ? `Currently building ${profile.building}`
    : latest ? `Currently building ${latest.name} · pushed ${ago(latest.pushedAt)} ago` : "Currently building something new";

  const ticker = [
    `${projects.length} projects in orbit`,
    activity ? `${activity.total} contributions this year` : "Shipping every week",
    ...profile.focus,
    profile.location,
    profile.openTo.replace(/\.$/, ""),
  ].filter(Boolean);

  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <SkyCanvas />
      <ScrollDirector />
      <Nav />
      <Hud />
      <main>
        <Hero profile={profile} building={building} />
        <Ticker items={ticker} />
        <Activity data={activity} profileUrl={profile.github} handle={profile.githubUser} />
        <Voyage projects={projects} />
        <Archive items={content.archive} />
        <Log entries={content.log} />
        <Wins wins={content.wins} certs={content.certs} />
        <Stack groups={content.skills} />
        <Faq items={content.faq} />
        <Contact profile={profile} resumeUrl={content.resumeUrl} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(homeJsonLd(content))} />
    </>
  );
}
