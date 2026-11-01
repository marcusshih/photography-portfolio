import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://marcusshih.github.io",
  base: "/photography-portfolio",
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
