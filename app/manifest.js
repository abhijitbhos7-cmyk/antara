export default function manifest() {
  return {
    name: "Antara Wellness",
    short_name: "Antara",
    description: "Focus better. Feel every moment.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b3d33",
    theme_color: "#0b3d33",
    icons: [
      {
        src: "/antara-logo.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}