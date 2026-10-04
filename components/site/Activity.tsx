import type { Activity as Data } from "@/lib/github";
import { CalTooltip, CountUp } from "./ActivityClient";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function Activity({ data, profileUrl, handle }: { data: Data | null; profileUrl: string; handle: string }) {
  const pad = data ? new Date(data.days[0].date + "T00:00:00Z").getUTCDay() : 0;
  return (
    <section id="github" data-sec="01 · Activity">
      <div className="wrap">
        <div className="mono">01 — Activity</div>
        <h2 className="roll"><span className="ln"><span>A year of</span></span><span className="ln"><span className="serif">shipping, live.</span></span></h2>
        <div className="glass gh fade">
          <div className="gh-top">
            <div className="stats">
              <div className="stat"><CountUp to={data?.total ?? 0} /><small>contributions in 12 months</small></div>
              <div className="stat"><CountUp to={data?.longestStreak ?? 0} /><small>longest streak, days</small></div>
              <div className="stat"><CountUp to={data?.bestDay ?? 0} /><small>most in one day</small></div>
            </div>
            <a className="btn glass" href={profileUrl} target="_blank" rel="noopener noreferrer">github.com/{handle}</a>
          </div>
          {data ? (
            <CalTooltip>
              <div className="cal" role="img" aria-label={`${data.total} GitHub contributions in the last year`}>
                {Array.from({ length: pad }, (_, i) => <i key={`p${i}`} className="blank" />)}
                {data.days.map((d, i) => (
                  <i key={d.date} data-l={d.level} data-tip={`${d.count} · ${fmt(d.date)}`} style={{ transitionDelay: `${Math.floor((i + pad) / 7) * 12}ms` }} />
                ))}
              </div>
            </CalTooltip>
          ) : (
            <p className="mono">Activity is taking a moment to load. It refreshes every hour.</p>
          )}
          <div className="gh-foot mono">
            <span>{data ? `${fmt(data.days[0].date)} — ${fmt(data.days.at(-1)!.date)}` : ""}</span>
            <span>Synced from GitHub every hour</span>
          </div>
        </div>
      </div>
    </section>
  );
}
