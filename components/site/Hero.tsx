import type { Profile } from "@/lib/content/types";
import Roller from "./Roller";
import { Arrow } from "./icons";

function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className="ch" style={{ animationDelay: `${delay + i * 0.045}s` }}>{c === " " ? " " : c}</span>
      ))}
    </span>
  );
}

export default function Hero({ profile, building }: { profile: Profile; building: string }) {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");
  return (
    <section className="hero wrap" id="top">
      <div className="mono fade">{profile.focus.join(" · ")}</div>
      <h1 aria-label={`${profile.name} builds`}>
        <span className="ln"><Letters text={first} delay={0.15} /></span>
        <span className="ln">
          <Letters text={last} delay={0.15 + first.length * 0.045} />{" "}
          <span className="serif ch" style={{ animationDelay: ".6s" }} aria-hidden="true">builds</span>
        </span>
      </h1>
      <div className="hero-row">
        <div>
          <p className="lede fade">
            Software that <Roller words={profile.verbs} />
            <br />
            {profile.intro}
          </p>
          <div className="btns fade">
            <a className="btn solid" href="#work">Launch into my work <Arrow /></a>
            <a className="btn glass" href="#contact">Resume</a>
          </div>
        </div>
        <div className="pill glass fade">
          <span className="pulse" aria-hidden="true" />
          <span>{building}</span>
        </div>
      </div>
    </section>
  );
}
