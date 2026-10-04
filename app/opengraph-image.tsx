import { ImageResponse } from "next/og";

export const alt = "Dhanesh Shetty — software that thinks, sees and flies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link preview: the climb from day sky into orbit, in one frame.
export default function OG() {
  const stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 397) % 1200, y: (i * 211) % 300, s: (i % 3) + 1 }));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, position: "relative",
        background: "linear-gradient(180deg, #020409 0%, #07102a 45%, #1d3c7a 78%, #7fb0e6 100%)", color: "#eef2fa", fontFamily: "sans-serif" }}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.s, height: s.s, borderRadius: 9, background: "rgba(255,255,255,.8)" }} />
        ))}
        <div style={{ position: "absolute", left: -200, right: -200, bottom: -1180, height: 1400, borderRadius: "50%", border: "3px solid rgba(110,160,255,.9)", boxShadow: "0 0 80px rgba(80,140,255,.8)", background: "#030713" }} />
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "rgba(238,242,250,.6)", marginBottom: 18 }}>AI agents · Mobile · Robotics · Automation</div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 600, letterSpacing: -6, lineHeight: 0.95 }}>Dhanesh Shetty</div>
        <div style={{ display: "flex", fontSize: 40, color: "rgba(238,242,250,.8)", marginTop: 18, marginBottom: 40 }}>Software that thinks, sees and flies.</div>
      </div>
    ),
    size,
  );
}
