import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dhanesh Shetty",
    short_name: "Dhanesh",
    description: "AI agents, apps, drones and automation by Dhanesh Shetty.",
    start_url: "/",
    display: "standalone",
    background_color: "#03050c",
    theme_color: "#03050c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
