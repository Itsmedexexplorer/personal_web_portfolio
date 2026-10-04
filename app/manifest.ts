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
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
