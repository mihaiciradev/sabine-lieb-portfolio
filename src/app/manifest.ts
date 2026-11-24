import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sabine Lieb, arhitect",
    short_name: "Sabine Lieb",
    description: "Portofoliu de arhitectură, Timișoara. Architecture portfolio, Timișoara.",
    lang: "ro",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f2f0eb",
    theme_color: "#3d4891",
    categories: ["design", "portfolio", "architecture"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
