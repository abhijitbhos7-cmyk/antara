export default function manifest() {
  return {
    name: "Antara",
    short_name: "Antara",
    description: "Find your inner rhythm.",
    start_url: "/",
    display: "standalone",
    background_color: "#080A18",
    theme_color: "#080A18",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}